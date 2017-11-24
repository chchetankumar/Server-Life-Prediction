import React from 'react';
import ReactDOM from 'react-dom';

class Globe extends React.Component{


    constructor(props){
        super(props);
        this.state={ globe_data:null };
        this.globe=null;
        this.bubble_map = null;


    }
    componentDidMount(){
         this.bubble_map = new Datamap({element: document.getElementById('globe_div'),
                        fills: {
                            defaultFill: '#f7b98f',
                            'b1': '#2b8a1e',
                            'b2': 'blue',
                            'b3': 'orange',
                            'b4': 'red'
                        }
                        });
    }
    componentWillMount() {
            // Do the Ajax Query Here

        $.ajax({ 'url': 'https://chetan-techjam.deploy.akamai.com/cgi/handle_globe_data.cgi',
                'success': function (data) {
                //console.log(dataText);
                //var data = JSON.parse(dataText);
                /*var colors = {
                    'B4': 3,
                    'B3': 2,
                    'B2' :1,
                    'B1' :0,
                };
                var globe_data={'B1':[], 'B2':[],'B3':[], 'B4':[]};
                for ( var i in data ) {
                    var [latitude,longitude]= i.split(':');
                    var categories=['B1','B2','B3','B4'];
                    for ( var z in categories ) {
                        if (data[i].hasOwnProperty(categories[z]) && data[i][categories[z]] && data[i][categories[z]] > 0 ) {
                            globe_data[categories[z]].push(parseFloat(latitude));
                            globe_data[categories[z]].push(parseFloat(longitude));
                            globe_data[categories[z]].push(parseFloat(data[i][categories[z]]));
                            globe_data[categories[z]].push(colors[categories[z]]);
                        }
                    }
                } 
                this.setState({globe_data:globe_data});   */ 
                var globe_data=[];
                var dc_details = data['dc_details'];
                var stats_data = data['data_values'];
                
                for( var i in dc_details ) {
                    var [lat,lon]=i.split(':');
                    var name = dc_details[i]['dc_name']+'('+dc_details[i]['dc_id']+')'; 
                    var city=dc_details[i]['city'];
                    var state=dc_details[i]['state'];
                    var country=dc_details[i]['country'];
                    var b1=(stats_data[dc_details[i]['dc_id']]['B1'])?parseInt(stats_data[dc_details[i]['dc_id']]['B1']):0;
                    var b2=(stats_data[dc_details[i]['dc_id']]['B2'])?parseInt(stats_data[dc_details[i]['dc_id']]['B2']):0;
                    var b3=(stats_data[dc_details[i]['dc_id']]['B3'])?parseInt(stats_data[dc_details[i]['dc_id']]['B3']):0;
                    var b4=(stats_data[dc_details[i]['dc_id']]['B4'])?parseInt(stats_data[dc_details[i]['dc_id']]['B4']):0;
                    var fillkey='';
                    if ( b4 > b3 && b4 > b2 && b2 > b1 ){
                        fillkey='b4';
                    } else if ( b3 > b4 && b3 > b2 && b3 > b1 ){
                        fillkey='b3';
                    }else if ( b2 > b4 && b2 > b3 && b2 > b1 ){
                        fillkey='b2';
                    }else if ( b1 > b3 && b1 > b2 && b1 > b4 ){
                        fillkey='b1';
                    }
                    globe_data.push({ 'name': name, 'radius':4, 'city': city, 'country':country, 'latitude':lat, 'longitude':lon, 'b1':b1, 'b2':b2, 'b3':b3, 'b4':b4, 'fillKey':fillkey  });
                }
                this.setState({'globe_data':globe_data });
            }.bind(this)
        });        

    }
       /* this.globe=new DAT.Globe($(this.globe_div)[0], { colorFn: function(label) {
        console.log(label);
       return new THREE.Color([
         0xd9d9d9, 0xb6b4b5, 0x9966cc, 0x15adff, 0x3e66a3,
         0x216288, 0xff7e7e, 0xff1f13, 0xc0120b, 0x5a1301, 0xffcc02,
         0xedb113, 0x9fce66, 0x0c9a39,
         0xfe9872, 0x7f3f98, 0xf26522, 0x2bb673, 0xd7df23,
         0xe6b23a, 0x7ed3f7][label]);
    }});*/

    componentDidUpdate () {
        if ( this.state.globe_data != null  ) {
             /*this.globe=new DAT.Globe($(this.globe_div)[0], { colorFn: function(label) {
             console.log(label);
             return new THREE.Color([0x20ea17, 0x1719ea, 0xea9017, 0xea1739 ] [label]);
            }});
            for ( var i in this.state.globe_data ) {
                this.globe.addData(this.state.globe_data[i], {name:i, format:'legend',animated:true});
            }
            /*this.globe.addData([[[22.3800000, 114.1800000, 15*200, 22.2700000, 166.4500000, 4*200],{name:'Test', format:'legend',animated:true}],
                            [[22.3800000, 114.1800000, 15*200, 22.2700000, 166.4500000, 4*200],{name:'Test2', format:'legend',animated:true}]]

                        );
           this.globe.createPoints();
           this.globe.animate();*/ 
            this.bubble_map.bubbles(this.state.globe_data,{
                popupTemplate: function(geo, data) {
                    return '<div class="hoverinfo">' + data.name + ', ' + data.city + ','  + data.country + '<br/>B1:'+data.b1 +'<br/>B2:'+data.b2+'<br/>B3:'+data.b3+'<br/>B4:'+data.b4
                }
            });
        }
  }
  render(){
        return(<div id='globe_div' ref={(input)=>this.globe_div=input} style={{"height":"500px"}}></div>);
  }

}


export default Globe;
