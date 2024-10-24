import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebaseApp from '../firebase';
import './HomePage.css';

const auth = getAuth(firebaseApp);

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/');
        }
        if (user) {
          const idToken = localStorage.getItem('firebaseToken');
          const response = await fetch('https://secondbrainbe.onrender.com/get-links', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          if (response.ok) {
            const result = await response.json();
            setData(result);
          } else {
            console.error('Failed to fetch user-specific data:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = () => {
    const idToken = localStorage.getItem('firebaseToken');
    console.log("id token is extracted", idToken)
    window.postMessage({ action: "logOut",message: idToken},"*");
    signOut(auth).then(() => {
      window.location.href = '/';
    }).catch((error) => {
      console.error('Error during sign-out:', error);
    });
  };

  const handleDelete = async (id) => {
    try {
      const idToken = localStorage.getItem('firebaseToken');
      const response = await fetch(`https://secondbrainbe.onrender.com/delete-link?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        setData(data.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete the link:', response.statusText);
      }
    } catch (error) {
      console.error('Error during delete operation:', error);
    }
  };

  const filteredData = (Array.isArray(data) ? data : []).filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.url.toLowerCase().includes(search.toLowerCase())
  );

  // Function to format the link text
  const formatLinkText = (url) => {
    const match = url.match(/:\/\/(.*?)\./);
    console.log(url, match)
    return match ? `This is a ${match[1]} link` : url; 
  };

  return (
    <div className="home-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <button onClick={handleSignOut}>Sign Out</button>
      <div className="grid">
        {filteredData.map((item) => (
          <div key={item.id} className="grid-item">
            <h3>{item.title}</h3>
            <span>{formatLinkText(item.url)}</span>
            {item.screenshot && <img src={item.screenshot} alt={item.title} />}
            <button className="delete-button" onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
