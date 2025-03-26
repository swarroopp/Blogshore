import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import '../css/Articles.css';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    dateFilter: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const categories = [...new Set(articles.map(article => article.category || 'General'))];

  // Verify user role when component mounts
  useEffect(() => {
    const verifyUserRole = async () => {
      if (user?.emailAddresses?.length > 0) {
        try {
          const token = await getToken();
          const userData = {
            email: user.emailAddresses[0].emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.imageUrl,
            // Initially try as an author
            role: 'author'
          };

          // Try to verify as author first
          let response = await axios.post('https://blogshore.onrender.com/author-api/author', userData, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // If not an author, try as user
          if (response.data.message === "Invalid role") {
            userData.role = 'user';
            response = await axios.post('https://blogshore.onrender.com/user-api/user', userData, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }

          setUserRole(response.data.message);
        } catch (err) {
          console.error('Failed to verify user role:', err);
          setUserRole('user'); // Default to user role on error
        }
      }
    };

    verifyUserRole();
  }, [user, getToken]);

  async function getArticles() {
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await axios.get('https://blogshore.onrender.com/author-api/articles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.message === 'articles') {
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);
        setError('');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch articles');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [filters, articles]);

  const filterArticles = () => {
    let filtered = [...articles];

    if (filters.keyword) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        article.content.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(article => 
        (article.category || 'General') === filters.category
      );
    }

    if (filters.dateFilter) {
      const today = new Date();
      filtered = filtered.filter(article => {
        const articleDate = new Date(article.dateOfModification);
        const diffTime = Math.ceil((today - articleDate) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateFilter) {
          case '30':
            return diffTime <= 30;
          case '90':
            return diffTime <= 90;
          default:
            return true;
        }
      });
    }

    setFilteredArticles(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  }

  return (
    <div className="shore-container">
  
      <div className="filter-section">
        <div className="filter-wrapper">
          <div className="search-box">
            <i className="search-icon">🔍</i>
            <input
              type="text"
              placeholder="Search the ocean of articles..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>
          
          <div className="filter-selects">
            <select
              className="category-select"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="time-select"
              value={filters.dateFilter}
              onChange={(e) => handleFilterChange('dateFilter', e.target.value)}
            >
              <option value="">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          
          {userRole === 'author' && (
            <button 
              className="new-wave-button"
              onClick={() => navigate('../article')}
            >
              <span className="button-icon">🌊</span>
              <span>Create New Wave</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="wave-loader">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
          <p>Collecting waves from the shore...</p>
        </div>
      ) : (
        <div className="shore-content">
          {error.length !== 0 && (
            <div className="error-message">
              <span>🌊 {error} 🌊</span>
            </div>
          )}
          
          <div className="waves-grid">
            {filteredArticles.map((articleObj, index) => (
              <div 
                className="wave-card" 
                key={articleObj.articleId}
                style={{"--delay": `${index * 0.1}s`}}
              >
                <div className="wave-top">
                  <div className="category-bubble">{articleObj.category || 'General'}</div>
                </div>
                
                <h3 className="wave-title">{articleObj.title}</h3>
                
                <p className="wave-excerpt">
                  {articleObj.content.substring(0, 120) + "..."}
                </p>
                
                <div className="wave-footer">
                  <div className="author-info">
                    <img
                      src={articleObj.authorData.profileImageUrl}
                      className="author-avatar"
                      alt={articleObj.authorData.nameOfAuthor}
                    />
                    <div className="author-details">
                      <span className="author-name">{articleObj.authorData.nameOfAuthor}</span>
                      <span className="wave-date">{new Date(articleObj.dateOfModification).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="ride-wave-button"
                    onClick={() => gotoArticleById(articleObj)}
                  >
                    Ride this wave
                  </button>
                </div>
                
                <div className="wave-decoration"></div>
              </div>
            ))}
          </div>
          
          {filteredArticles.length === 0 && !isLoading && !error && (
            <div className="no-waves">
              <div className="empty-shore-image"></div>
              <p>No waves have reached the shore yet...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Articles;  