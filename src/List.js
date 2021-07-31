import React from 'react';
import {ReactComponent as Check} from './check.svg';
import { sortBy } from 'lodash';
import './App.css';
import {ReactComponent as Up} from './upArrow.svg'
import {ReactComponent as Down} from './downArrow.svg'



const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(),
    POINT: list => sortBy(list, 'points').reverse(),
    };

const List = React.memo(({ list, onRemoveItem }) => {
    const [sort, setSort] = React.useState({
        sortKey: "NONE",
        isReverse: false,
        isTitle: false,
        isAuthor: false,
        isComment: false,
        isPoint: false,
        titleArrow: false,
        authorArrow: false,
        commentArrow: false,
        pointArrow: false,
    });

    const handleSort = sortKey => {
        const isReverse = sort.sortKey === sortKey && !sort.isReverse;
        if (sortKey === "TITLE"){
            const isTitle = true;
            const titleArrow = true;
            setSort( {sortKey: sortKey, isReverse: isReverse, isTitle: isTitle, titleArrow});
        }
        else if (sortKey === "AUTHOR"){
            const isAuthor = true;
            const authorArrow = true;
            setSort( {sortKey: sortKey, isReverse: isReverse, isAuthor, authorArrow});
        }
        else if (sortKey === "COMMENT"){
            const isComment = true;
            const commentArrow = true;
            setSort( {sortKey: sortKey, isReverse: isReverse, isComment, commentArrow});
        }
        else if (sortKey === "POINT"){
            const isPoint = true;
            const pointArrow = true;
            setSort( {sortKey: sortKey, isReverse: isReverse, isPoint, pointArrow});
        }
        
    };



    const sortFunction = SORTS[sort.sortKey];
    const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

    return (
        <div>
        <div style={{ display: 'flex' }}>
            <span style={{ width: '40%' }}>
                <button id='TITLE' type="button" onClick={() => {handleSort('TITLE')}} className={sort.isTitle ? "activeButton" : null}>
                    Title {sort.titleArrow? sort.isReverse ? <Down height="8px" width="8px" className={sort.isTitle ? "activeButton" : null}/> : <Up height="8px" width="8px" className={sort.isTitle ? "activeButton" : null}/> : null}
                </button>
            </span>
            <span style={{ width: '30%' }}>
                <button id='AUTHOR' type="button" onClick={() => {handleSort('AUTHOR')}} className={sort.isAuthor? "activeButton" : null}>
                    Author {sort.authorArrow? sort.isReverse ? <Down height="8px" width="8px" className={sort.isTAuthor ? "activeButton" : null}/> : <Up height="8px" width="8px" className={sort.isTitle ? "activeButton" : null}/> : null}
                </button>             
            </span>
            <span style={{ width: '10%' }}>
                <button id="COMMENT" type="button" onClick={() => {handleSort('COMMENT')}} className={sort.isComment? "activeButton" : null}>
                    Comments {sort.commentArrow? sort.isReverse ? <Down height="8px" width="8px" className={sort.isComment ? "activeButton" : null}/> : <Up height="8px" width="8px" className={sort.isTitle ? "activeButton" : null}/> : null}
                </button>
            </span>
            <span style={{ width: '10%' }}>
                <button id="POINT" type="button" onClick={() => {handleSort('POINT')}} className={sort.isPoint? "activeButton" : null}>
                    Points {sort.pointArrow? sort.isReverse ? <Down height="8px" width="8px" className={sort.isPoint ? "activeButton" : null}/> : <Up height="8px" width="8px" className={sort.isTitle ? "activeButton" : null}/> : null}
                </button>
            </span>
            <span style={{ width: '10%' }}>Actions</span>
        </div>
        {/* list is [{title: 'React', url: 'https://reactjs.org',author: "Jordan Walke",num_comments: 3,points: 4,objectID: 0,}]
        item is the object {title: 'React', url: 'https://reactjs.org',author: "Jordan Walke",num_comments: 3,points: 4,objectID: 0,} */}
        {sortedList.map(item => (
            <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
    </div>
    );
})

const Item = ({ item, onRemoveItem }) => {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
    return (
    <div style={{ display: 'flex'}} className="item">
        <span style={{ width: '40%'}}>
            <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%'}}>{item.author}</span>
        <span style={{ width: '10%'}}>{item.num_comments}</span>
        <span style={{ width: '10%'}}>{item.points}</span>
        <span style={{ width: '10%'}}>
            <button type="button" className="button buttonSmall" onClick={() => onRemoveItem(item)}>
                <Check height="18px" width="18px"/>
            </button>
        </span>
    </div>
    );
};

export default List;