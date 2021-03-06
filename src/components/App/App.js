import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify'

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
        searchResults: this.getLocalStorageSearchResults(),

        playlistName: 'New Playlist', 

        playlistTracks: []
        }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
        this.getLocalStorageSearchResults = this.getLocalStorageSearchResults.bind(this);
        this.setLocalStorageSearchResults = this.setLocalStorageSearchResults.bind(this);
    }

    addTrack(track){
        if (!this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
        let tempPlaylistTracks = this.state.playlistTracks;
        tempPlaylistTracks.push(track);
        this.setState({
            playlistTracks : tempPlaylistTracks
        })
        // remove from search results array what's in the playlist array
        let tempSearchResult = this.state.searchResults.filter((searchResultsTrack)=>{
            return searchResultsTrack.id !== track.id
        })
        this.setState({
            searchResults : tempSearchResult
        })
        }

        this.setLocalStorageSearchResults();
    }

    removeTrack(track){
        let tempPlaylistTracks = this.state.playlistTracks.filter((playlistTrack)=>{
        return playlistTrack.id !== track.id
        })
        this.setState({
        playlistTracks : tempPlaylistTracks
        })
        //add what we removed from playlist at the top of search results
        let tempSearchResult = this.state.searchResults;
        tempSearchResult.unshift(track);
        this.setState({
            searchResults : tempSearchResult
        })

        this.setLocalStorageSearchResults();
    }

    updatePlaylistName(name){
        this.setState({
        playlistName : name
        })
    }

    savePlaylist(){
        let progressBarContainer = document.getElementById('myProgress');
        let progressBar = document.getElementById('myBar');
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '85%' ;

        let trackURIs = this.state.playlistTracks.map(track => track.uri);

        if (this.state.playlistName && trackURIs && trackURIs.length > 0) {
            Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
                console.log(`new playlist with '${this.state.playlistName}' and ${trackURIs.length} songs successful saved.`);
                this.setState({playlistName: 'New Playlist', playlistTracks: [], searchResults:[]});
                this.setLocalStorageSearchResults();
            });
        }

        setTimeout(()=>{progressBar.style.width = '100%'}, 500);
        setTimeout(()=>{progressBarContainer.style.display = 'none'}, 1000);
        progressBar.style.width = '0';

        
    }

    search(term){
        Spotify.search(term).then(tracks => {
            this.setState({searchResults: tracks});
            this.setLocalStorageSearchResults();
        });
    }

    setLocalStorageSearchResults(){
        localStorage.setItem('searchResult',JSON.stringify({
            searchResults: this.state.searchResults
        }))
    }

    getLocalStorageSearchResults(){
        let localstorageSearchResults = JSON.parse(localStorage.getItem('searchResult'));
        if(localstorageSearchResults){
            console.log(localstorageSearchResults.searchResults)
            return localstorageSearchResults.searchResults;
        }
    }

    render() {
        return (
        <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div id="myProgress"> 
                <div id="myBar"></div> 
            </div>
            <div className="App">
            <SearchBar onSearch={this.search} />
            <div className="App-playlist">
                <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
                <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
            </div>
            </div>
        </div>
        );
    }
}

export default App;
