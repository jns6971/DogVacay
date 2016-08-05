import React from 'react';
import ReactDOM from 'react-dom';
import Test from 'components/Test';

const dest = document.getElementById('content');

var PetSearchApp = React.createClass({
  getInitialState: function() {
    return {
      search: null
    };
  },
  componentDidMount: function() {

    this.loadPetData();

  },

  loadPetData: function(service){
  	var xhr = new XMLHttpRequest();

  	xhr.onreadystatechange = function() {
  		if(xhr.readyState === 4) {
  			if(xhr.status === 200) {
  				this.setState({
  					search: JSON.parse(xhr.responseText).search
  				});
  			}
  			else{
  				console.log('an error has occured: ', xhr.status);
  			}
  		}
  	}.bind(this);

  	//dynamically set service parameter
  	xhr.open('Get', (service)? this.props.api_url+'?service='+service : this.props.api_url);
  	xhr.send();
  },

  onSearchChange: function(changeEvent){
  	this.loadPetData(changeEvent.target.value);
  },

  render: function() {

  	if(this.state.search){

  		var petSearchResults = this.state.search.map(function(searchItem){
  			return (
  				<PetSearchResult data={searchItem} />
  			);
  		});

	    return (
	      <div className="ps-container">

	      	<fieldset  className="ps-filter">
	      		<legend>Search For</legend>
	      		<ul>
	      			<li className="ps-filter__item">
	      				<input id="search-boarding" name="search-filter" onChange={this.onSearchChange} type="radio" value="boarding" />
	      				<label htmlFor="search-boarding">Boarding <br/><span>at Host's home</span></label>
	      			</li>
	      			<li className="ps-filter__item">
	      				<input id="search-sitting" name="search-filter" onChange={this.onSearchChange} type="radio" value="sitting" />
	      				<label htmlFor="search-sitting">Sitting <br/><span>at my home</span></label>
	      			</li>
	      		</ul>
	      	</fieldset>

	        <ul className="ps-results">
	        	{petSearchResults}
	        </ul>
	      </div>
	    );
	}
	else{
        return (null);
	}
  }
});

var PetSearchResult = React.createClass({

  //returns first letter capitalized
  capitalize: function(str){
  	return str.charAt(0).toUpperCase() + str.slice(1);
  },

  //add ellipsis to string if it passes max character count.
  //returns string with ellipsis and not ending in middle of word
  ellipsis: function(str, maxChar){
  	var maxChar = maxChar || 48;

  	//check is string is longer than m
  	if(str.length>maxChar){
  		//check if final char is not space
  		if(str.charAt(maxChar-1) !== ' '){
  			//if following final char is space then it is the end of a word
  			if(str.charAt(maxChar) !== ' '){
  				//shorten string to final space.
  				str = str.substring(0,maxChar);
  				str =str.substring(0,str.lastIndexOf(' '));
  			}
  			else{//final character is end of word
  				str =str.substring(0,maxChar);
  			}
  		}
  		else{//final char is space
  			str = str.substring(0,maxChar-1);
  		}

  		//add ellipses 
  		str += String.fromCharCode(8230);
  	}

  	return str;
  },

  //reformat string to replace spaces with hyphens, do not allow double hyphens
  urlFormat: function(str){
  	return str.replace(/\s/g , "-").replace(/-+/g,"-").replace(/[^\w-]+/g,'');
  },

  render: function() {

  	var username = this.capitalize(this.props.data.user.first) + ' ' + this.capitalize(this.props.data.user.last),
  		url = this.urlFormat(this.props.data.url.title),
  		description = this.ellipsis(this.props.data.description, 48);


    return (
	  	<li className="ps-result__item">
	  		<h2 className="ps-result-title">{this.props.data.title}</h2>
	  		<a href={this.props.data.url.href}>{url}</a>
	  		<p className="ps-result-username">{username}</p>
	  		<p className="ps-result-petname">{this.props.data.pet.name}</p>
	  		<p className="ps-result-desc">{description}</p>
	  	</li>
	);
  }
});


ReactDOM.render(
  <PetSearchApp api_url="static/search.json"/>,
  dest
);

window.React = React; // enable debugger
