import React from 'react';
import ReactDOM from 'react-dom';

class Globe extends React.Component{


    constructor(props){
        super(props);
        this.state={ globe_data:null };

    }
    componentWillMount() {
            // Do the Ajax Query Here
        

    }

    render(){
        return(<div>Test</div>);

    }

}


export default Globe;
