import React from 'react';



class DcDetails extends React.Component {

    constructor(props){
        super(props);
        this.state= {
                    'dc_name':'',
                    'server_info':[]
        };
        this.dc_id=null;
    }
    setServerInfo = function(dc_id) {
        $.ajax({ 'url' : 'https://chetan-techjam.deploy.akamai.com/cgi/handle_dc_details.cgi?dc_id='+dc_id,
                'success': function(data) {
                        this.setState( { server_info : data['servers'],
                                        dc_name: data['dc_name']
                            });
                }.bind(this)
            });
    }.bind(this);
    componentWillReceiveProps(nextProps) {
        console.log('Will Receive Props');
        this.setServerInfo(nextProps.params.dc_id);
    }
    componentWillMount(){
        console.log('Will Mount');
        this.setServerInfo(this.props.params.dc_id);
    }
    shouldComponentUpdate() {
        console.log('Should Update');
        if ( this.dc_id != this.props.params.dc_id ) {
            return true;
        } else {
            return false;
        }
    }
    componentWillUpdate(){
        console.log('Will Update');
    }
    componentDidUpdate(){
        if ( $.fn.DataTable.isDataTable($(this.tab)) ) {
            $(this.tab).dataTable().fnDestroy();
            console.log('Destroyed');
        }
        this.dc_id= this.props.params.dc_id;
        var options= {
            //'buttons':[],
             //'sDom':'lfrtip',
            "aoColumns": [
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                        {"bSortable": false},
                    ]
        };
        $(this.tab).nieDataTables();
        $.each($(".nieDatatables-toolbar>.nieDatatables-options"), function ( c, v ) {
            if ( $(v).html() =="&nbsp;" ) {
                    $(v).html("DataCenter Server Health Information For: " +this.state.dc_name);
            }
        }.bind(this));
    }
    render() {
        let i=1;
        if ( $.fn.DataTable.isDataTable($(this.tab)) ) {
            $(this.tab).dataTable().fnDestroy();
        }
        if ( this.state.server_info.length > 0 ) {
        console.log('Render'); //console.log($(".widget-container"));
        return (<div className="widget-container">
                <table className='widget-datatable datatable' ref={(input)=>this.tab=input}>
                    <thead>
                        <tr key={'head_0'}>
                        <th>Serial Number  </th>
                        <th>Product</th>
                        <th>Server Type </th>
                        <th>Region </th>
                        <th>DataCenter</th>
                        <th>Network</th>
                        <th>Warranty End Date</th>
                        <th>Server Age</th>
                        <th>Down Days</th>
                        <th>Likely to Fail(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.server_info.map ( function(row) {
                            return ( <tr key={'row_'+i++}>
                                        <td>{row[0]}</td>
                                        <td>{row[1]}</td>
                                        <td>{row[2]}</td>
                                        <td><a href={"https://netarch.akamai.com/region/"+ row[3]} target='_blank'>{row[4]}</a></td>
                                        <td><a href={"https://netarch.akamai.com/datacenter/"+ row[5]} target='_blank'>{row[6]}</a></td>
                                        <td>{row[7]}</td>
                                        <td>{row[8]}</td>
                                        <td>{row[7]}</td>
                                        <td>{row[9]}</td>
                                        <td>{row[12]}</td>
                                    </tr>)


                        })
                        }

                    </tbody>

                </table>
            </div>)
        } else {
            return (
                <div className="widget-preloader">
                                    <div className="ak-preloader ak-preloader-blue ak-preloader-centered">
                                        <div className="crescent-1"></div>
                                        <div className="crescent-2"></div>
                                        <div className="crescent-3"></div>
                                    </div>
                                </div>

             )

        }

    }

}


export default DcDetails;
