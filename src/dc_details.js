import React from 'react';



class DcDetails extends React.Component {

    constructor(props){
        super(props);
        this.state= { 'dc_id':this.props.dc_id,
                    'dc_name': this.props.dc_name,
                    'server_info':[]
        };
        
    }

    componentWillMount(){


    }
    render() {
        return (<div className='widget-container'>
                <div className='widget-title'>
                    Server Health Status is DC { this.state.dc_name } 
                </div>

            </div>);

    }

}


export default DcDetails;
