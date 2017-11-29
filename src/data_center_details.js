import React from 'react';
import ReactDOM from 'react-dom';

export class DCDetails {

    constructor(props){
        super(props);
        this.state={
            dc_id:this.props.dc_id,
            dc_data:[],
        };
    }
    componentWillMount(){

        $.ajax({ "url": "https://chetan-techjam.deploy.akamai.com/dc_details/"+this.state.dc_id,
                "success": function(data) {


                }
        });
    }

}
