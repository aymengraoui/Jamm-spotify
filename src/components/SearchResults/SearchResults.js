import React from 'react';
import './SearchResults.css';

import TrackList from '../TrackList/TrackList'
class SearchResults  extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return(
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList isRemoval={false} onAdd={this.props.onAdd} trackList={this.props.searchResults}/>
            </div>
        )
    }
}

export default SearchResults;