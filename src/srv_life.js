import React from 'react';
import ReactDOM from 'react-dom';
import { Router,Redirect,Link, hashHistory,browserHistory, Route,IndexRoute } from 'react-router';
import Globe from './globe';

class SrvLife extends React.Component{

    constructor(){
    super();
    }
    render(){
        return (<Globe />)

    }


}

export default SrvLife;

ReactDOM.render(<SrvLife />,document.getElementById('app_root'));
