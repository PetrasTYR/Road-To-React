import React from 'react';
import axios from 'axios';
import './App.css';
import SearchForm from './SearchForm';
import List from './List';

// import logo from './logo.svg';
// import styles from './App.module.css';
// import styled from 'styled-components';
// import {ReactComponent as Check} from './check.svg';


const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    }
    else {
      console.log('A');
      localStorage.setItem(key, value);
      console.log("Changed");
    }
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      // console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const getSumComments = stories => {
  console.log("C");

  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const getLastSearches = urls => urls.slice(-5);

const extractSearchTerm = url => url.replace(API_ENDPOINT, '');

const getLastSearches = urls =>
  urls.slice(-5).map(url => extractSearchTerm(url));

const App = () => {

  // on first load, searchTerm is set to React
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  // on first load, url is set to https://hn.algolia.com/api/v1/search?query=React
  const [urls, setUrls] = React.useState([`${API_ENDPOINT}${searchTerm}`,]);

  // on first load, stories is set to { data: [], isLoading: false, isError: false }
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const sumComments = React.useMemo(() =>getSumComments(stories), [
    stories,
  ]);

  const handleLastSearch = url => {

  };

  const lastSearches = getLastSearches(urls);

  // A
  // const handleFetchStories = React.useCallback(() => {

  //   dispatchStories({ type: 'STORIES_FETCH_INIT' })

  //   axios
  //     .get(url)
  //     // .then(response => response.json())
  //     .then(result => {
  //       dispatchStories({
  //         type: 'STORIES_FETCH_SUCCESS',
  //         payload: result.data.hits,
  //       });
  //     })
  //     .catch(() => 
  //       dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
  //     );
  // }, [url]); // E

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length-1];
      const result = await axios.get(lastUrl);
      // const result = await axios.get(url);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: 'STORIES_FETCH_FAILURE'
      });
    }

  }, [urls]);

  React.useEffect(() => {
    handleFetchStories(); // C
  }, [handleFetchStories]); // D

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  },[]);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    const url = `${API_ENDPOINT}${searchTerm}`;
    setUrls(urls.concat(url));

    event.preventDefault();
  }
  const handleLastSearch = searchTerm => {
    const url = `${API_ENDPOINT}${searchTerm}`;
    setUrls(urls.concat(url));
  };

  console.log("B:App");

  // const searchedStories = stories.data.filter(story =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // console.log(searchTerm);

  return (

    <div className='container'>
      <h1 className="headline-primary">My Hacker Stories</h1>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
      {lastSearches.map(url => (
        <button key={searchTerm} type='button' onClick={() => handleLastSearch(searchTerm)}>{searchTerm}</button>
      ))}
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>

  );
}

const Text = () => 
  <p>This is a text component</p>


// const StyledContainer = styled.div`
//   height: 100vw;
//   padding 20px;

//   background: #83a4d4;
//   background: linear-gradient(to left, #b6fbff, #83a4d4);
//   color: #171212;
// `;
// const StyledHeadlinePrimary = styled.h1`
//   font-size: 48px;
//   font-weight: 300;
//   letter-spacing: 2px;
// `;

// const StyledItem = styled.div`
//   display: flex;
//   align-items: center;
//   padding-bottom: 5px;
// `;
// const StyledColumn = styled.span`
//   padding: 0 5px;
//   white-space: nowrap;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   a {
//   color: inherit;
//   }
//   width: ${props => props.width};
// `;

// const StyledButton = styled.button`
//   background: transparent;
//   border: 1px solid #171212;
//   padding: 5px;
//   cursor: pointer;

//   transition: all 0.1s ease-in;

//   &:hover {
//     background: #171212;
//     color: #ffffff;
//   }
// `;

// // const StyledButtonSmall = styled(StyledButton)`
// //   padding: 5px;
// // `;

// const StyledButtonLarge = styled(StyledButton)`
//   padding: 10px;
// `;

// const StyledSearchForm = styled.form`
//   padding: 10px 0 20px 0;
//   display: flex;
//   align-items: baseline;
// `;

// const StyledLabel = styled.label`
//   border-top: 1px solid #171212;
//   border-left: 1px solid #171212;
//   padding-left: 5px;
//   font-size: 24px;
// `;
// const StyledInput = styled.input`
//   border: none;
//   border-bottom: 1px solid #171212;
//   background-color: transparent;
//   font-size: 24px;
// `;

export default App;

// export {SearchForm, InputWithLabel, List, Item}