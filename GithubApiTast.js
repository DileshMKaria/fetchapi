import React, { useState, useEffect } from 'react';
import './GithubApiTast.css';

const GithubApiTast = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://api.github.com/users?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setUsers(prevUsers => [...prevUsers, ...data]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, searchTerm]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollY + windowHeight >= bodyHeight) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="github-api-tast-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {users.map(user => (
        <div className="github-user" key={user.id}>
          <img src={user.avatar_url} alt={user.login} />
          <p>{user.login}</p>
          <p>Followers: {user.followers}</p>
        </div>
      ))}
    </div>
  );
};

export default GithubApiTast;
