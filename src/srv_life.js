import React from 'react';
import ReactDOM from 'react-dom';
import { Router,Redirect,Link, hashHistory,browserHistory, Route,IndexRoute } from 'react-router';
import Globe from './globe';
import DcDetails from './dc_details';
class SrvLife extends React.Component{

    constructor(){
    super();
    }
    render(){
        return ( <Router history={hashHistory}>
                <Route path="/" component={Globe} >
                <Route path="dc_details/:dc_id" component={DcDetails} >
                </Route>
                </Route>
            </Router>)
    }


}

export default SrvLife;

ReactDOM.render(<SrvLife />,document.getElementById('app_root'));
