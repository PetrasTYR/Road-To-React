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
        data: 
          action.payload.page === 0
          ? action.payload.list
          : state.data.concat(action.payload.list),
        page: action.payload.page,
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

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const getUrl = (searchTerm, page) =>
`${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;

const extractSearchTerm = url => url
.substring(url.lastIndexOf('?') + 1, url.lastIndexOf("&"))
.replace(PARAM_SEARCH, '');

const getLastSearches = urls => 
  urls.reduce((result, url, index) => {
    const searchTerm = extractSearchTerm(url);
    if (index === 0) {
      return result.concat(searchTerm);
    }

    const previousSearchTerm = result[result.length - 1];

    if (searchTerm === previousSearchTerm) {
      return result;
    } else {
      return result.concat(searchTerm);
    }
  }, [])
  .slice(-6)
  .slice(0, -1);



const App = () => {

  // on first load, searchTerm is set to React
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  // on first load, urls is set to ['https://hn.algolia.com/api/v1/search?query=React']
  const [urls, setUrls] = React.useState([getUrl(searchTerm,0)]);
  console.log(urls);

  // on first load, stories is set to { data: [], isLoading: false, isError: false }
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], page: 0, isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length-1];
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {list: result.data.hits, page: result.data.page},
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

  const handleSearch = (searchTerm ,page)=> {
    const url = getUrl(searchTerm,page);
    setUrls(urls.concat(url));
  };

  const handleSearchSubmit = event => {
    handleSearch(searchTerm,0);
    event.preventDefault();
  }
  
  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm,0);
  };

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  };


  const lastSearches = getLastSearches(urls);

  console.log("B:App");

  return (

    <div className='container'>
      <h1 className="headline-primary">My Hacker Stories</h1>
      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit} />
      <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch}/>
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <button type='button' onClick={handleMore}>More</button>
      )}
      {/* <button type="button" onClick={handleMore}>
        More
      </button> */}
    </div>

  );
}

const Text = () => 
  <p>This is a text component</p>

const LastSearches = ({lastSearches, onLastSearch}) => (
<>
  {lastSearches.map((searchTerm, index) => (
  <button
    key={searchTerm + index}
    type="button"
    onClick={() => onLastSearch(searchTerm)}
    >
    {searchTerm}
  </button>
  ))}
</>
)

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