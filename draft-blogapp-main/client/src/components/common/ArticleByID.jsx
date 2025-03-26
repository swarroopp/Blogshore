import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userAuthorContextObj } from "../../contexts/UserAuthorContext";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { MdDelete, MdRestore } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import '../css/ArticleByID.css';

function ArticleByID() {
  const { state } = useLocation();
  const { currentUser } = useContext(userAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isOriginalAuthor, setIsOriginalAuthor] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simple check for author ownership - using both ID and name
    if (currentUser && currentArticle?.authorData) {
      // Check if current user's ID AND name matches the article author's
      const isAuthor = (
        currentUser.role === "author" && 
        currentUser.id === currentArticle.authorData.authorId &&
        currentUser.firstName === currentArticle.authorData.nameOfAuthor
      );
      
      setIsOriginalAuthor(isAuthor);
      
      // Exit edit mode if not the original author
      if (!isAuthor && editArticleStatus) {
        setEditArticleStatus(false);
        setSaveError("Only the original author can edit this article");
      }
    } else {
      setIsOriginalAuthor(false);
    }
  }, [currentUser, currentArticle, editArticleStatus]);

  // Function to format article content with paragraph breaks
  const formatContent = (content) => {
    if (!content) return "";
    
    // Split content by line breaks and render each paragraph
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="blogshore-content-paragraph">
        {paragraph}
      </p>
    ));
  };

  function enableEdit() {
    if (!isOriginalAuthor) {
      alert("Only the original author can edit this article");
      return;
    }
    setEditArticleStatus(true);
    setSaveError(""); // Clear any previous errors
  }

  async function onSave(modifiedArticle) {
    try {
      // Check again before saving
      if (!isOriginalAuthor) {
        setSaveError("Only the original author can edit this article");
        setEditArticleStatus(false);
        return;
      }
      
      setIsSaving(true);
      setSaveError("");
      
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token could not be retrieved");
      }
      
      // Create a properly structured object with all needed fields
      const articleAfterChanges = { 
        ...currentArticle, 
        title: modifiedArticle.title,
        content: modifiedArticle.content,
        category: modifiedArticle.category,
      };
      
      // Update modification date
      const currentDate = new Date();
      articleAfterChanges.dateOfModification = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      
      const res = await axios.put(
        `https://blogshore.onrender.com/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.message === "article modified" || res.status === 200) {
        setEditArticleStatus(false);
        // Use response payload if available, otherwise use our updated article
        const updatedArticle = res.data.payload || articleAfterChanges;
        setCurrentArticle(updatedArticle);
        // Update state for the page
        navigate(`/author-profile/articles/${currentArticle.articleId}`, {
          state: updatedArticle,
          replace: true
        });
      } else {
        throw new Error(`Unexpected response: ${res.data.message}`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      setSaveError(error.response?.data?.message || error.message || "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function addComment(commentObj) {
    try {
      setCommentStatus("");
      commentObj.nameOfUser = currentUser.firstName;
      
      let res = await axios.put(
        `https://blogshore.onrender.com/user-api/comment/${currentArticle.articleId}`,
        commentObj
      );
      
      if (res.data.message === "comment added") {
        setCommentStatus(res.data.message);
        // Update the current article with the new comment
        setCurrentArticle(prevArticle => ({
          ...prevArticle,
          comments: [...(prevArticle.comments || []), { ...commentObj, _id: Date.now() }]
        }));
      }
    } catch (error) {
      setCommentStatus("Failed to add comment: " + (error.message || "Unknown error"));
    }
  }

  async function deleteArticle() {
    try {
      // Check again before deleting
      if (!isOriginalAuthor) {
        alert("Only the original author can delete this article");
        return;
      }
      
      const token = await getToken();
      const articleToUpdate = { 
        ...currentArticle, 
        isArticleActive: false
      };
      
      let res = await axios.put(
        `https://blogshore.onrender.com/author-api/article/${currentArticle.articleId}`,
        articleToUpdate,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (res.data.message === "article deleted or restored" || res.status === 200) {
        setCurrentArticle(res.data.payload || articleToUpdate);
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article: " + (error.message || "Unknown error"));
    }
  }

  async function restoreArticle() {
    try {
      // Check again before restoring
      if (!isOriginalAuthor) {
        alert("Only the original author can restore this article");
        return;
      }
      
      const token = await getToken();
      const articleToUpdate = { 
        ...currentArticle, 
        isArticleActive: true
      };
      
      let res = await axios.put(
        `https://blogshore.onrender.com/author-api/article/${currentArticle.articleId}`,
        articleToUpdate,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (res.data.message === "article deleted or restored" || res.status === 200) {
        setCurrentArticle(res.data.payload || articleToUpdate);
      }
    } catch (error) {
      console.error("Error restoring article:", error);
      alert("Failed to restore article: " + (error.message || "Unknown error"));
    }
  }

  return (
    <div className="blogshore-article-container">
      <button 
        className="blogshore-back-button" 
        onClick={() => navigate(`/author-profile/articles`)}
      > 
        <FaArrowLeft size={16} />
        <span>Back to Articles</span>
      </button>

      {editArticleStatus === false ? (
        <>
          <div className="blogshore-article-header">
            <div className="blogshore-article-header-content">
              <div className="blogshore-article-main-info">
                <h1 className="blogshore-article-title">{currentArticle.title}</h1>
                <div className="blogshore-article-meta">
                  <span>Created on: {currentArticle.dateOfCreation}</span>
                  <span>Modified on: {currentArticle.dateOfModification}</span>
                </div>
                
                {isOriginalAuthor && (
                  <div className="blogshore-action-buttons">
                    <button className="blogshore-action-button edit" onClick={enableEdit}>
                      <FaEdit size={20} />
                      <span>Edit</span>
                    </button>
                    {currentArticle.isArticleActive ? (
                      <button className="blogshore-action-button delete" onClick={deleteArticle}>
                        <MdDelete size={22} />
                        <span>Delete</span>
                      </button>
                    ) : (
                      <button className="blogshore-action-button restore" onClick={restoreArticle}>
                        <MdRestore size={22} />
                        <span>Restore</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="blogshore-author-block">
                <div className="blogshore-author-details">
                  <img
                    src={currentArticle.authorData.profileImageUrl}
                    className="blogshore-author-avatar"
                    alt={currentArticle.authorData.nameOfAuthor}
                  />
                  <p className="blogshore-author-name">{currentArticle.authorData.nameOfAuthor}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="blogshore-article-content">
            {formatContent(currentArticle.content)}
          </div>

          <div className="blogshore-comments-section">
            <h2 className="blogshore-comments-title">Comments</h2>
            {currentArticle.comments && currentArticle.comments.length === 0 ? (
              <p className="blogshore-text-muted">No comments yet...</p>
            ) : (
              (currentArticle.comments || []).map((commentObj) => (
                <div key={commentObj._id} className="blogshore-comment-item">
                  <p className="blogshore-comment-user">{commentObj?.nameOfUser}</p>
                  <p className="blogshore-comment-text">{commentObj?.comment}</p>
                </div>
              ))
            )}
          </div>

          {currentUser?.role === "user" && (
            <div className="blogshore-comment-form">
              <form onSubmit={handleSubmit(addComment)}>
                <input
                  type="text"
                  {...register("comment", { required: true })}
                  className="blogshore-comment-input"
                  placeholder="Write a comment..."
                />
                <button type="submit" className="blogshore-submit-button">
                  Add Comment
                </button>
              </form>
              {commentStatus && (
                <p className={commentStatus.includes("Failed") ? "blogshore-text-error" : "blogshore-text-success"}>
                  {commentStatus}
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="blogshore-edit-form">
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="blogshore-form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="blogshore-form-input"
                defaultValue={currentArticle.title}
                {...register("title", { required: true })}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="category" className="blogshore-form-label">
                Select a category
              </label>
              <select
                {...register("category", { required: true })}
                id="category"
                className="blogshore-form-select blogshore-form-input"
                defaultValue={currentArticle.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="blogshore-form-label">
                Content
              </label>
              <textarea
                {...register("content", { required: true })}
                id="content"
                className="blogshore-form-textarea"
                defaultValue={currentArticle.content}
              ></textarea>
            </div>
            <div className="text-end">
              {saveError && <p className="blogshore-text-error mb-2">{saveError}</p>}
              <div className={isMobileView ? "full-width-buttons" : ""}>
                <button 
                  type="submit" 
                  className="blogshore-submit-button"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button"
                  className="blogshore-submit-button"
                  onClick={() => setEditArticleStatus(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ArticleByID;