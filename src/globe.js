import React from 'react';
import ReactDOM from 'react-dom';

class Globe extends React.Component{


    constructor(props){
        super(props);
        this.state={ globe_data:null };
        this.globe=null;


    }
    componentWillMount() {
            // Do the Ajax Query Here

        $.ajax({ 'url': 'https://chetan-techjam.deploy.akamai.com/cgi/handle_globe_data.cgi',
            'success': function (data) {
                //console.log(dataText);
                //var data = JSON.parse(dataText);
                var colors = {
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
                    
                    //globe_data[categories[z]].push([latitude,longitude,data[i][categories[z]]]);
                    }
                    }
                } 
                /*for ( var z in categories ) {
                    globe_data[categories[z]].push({'name':categories[z],'format':'magnitude','animated':true});
                }*/
                //console.log(globe_data);
                this.setState({globe_data:globe_data});    
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

             this.globe=new DAT.Globe($(this.globe_div)[0], { colorFn: function(label) {
             console.log(label);
             return new THREE.Color([0x20ea17, 0x1719ea, 0xea9017, 0xea1739 ] [label]);
            }});
            for ( var i in this.state.globe_data ) {
                this.globe.addData(this.state.globe_data[i], {name:i, format:'legend',animated:true});
            }
            /*this.globe.addData([[[22.3800000, 114.1800000, 15*200, 22.2700000, 166.4500000, 4*200],{name:'Test', format:'legend',animated:true}],
                            [[22.3800000, 114.1800000, 15*200, 22.2700000, 166.4500000, 4*200],{name:'Test2', format:'legend',animated:true}]]

                        );*/
           this.globe.createPoints();
           this.globe.animate(); 
        }
  }
  render(){
        return(<div ref={(input)=>this.globe_div=input} style={{"height":"400px"}}>Test</div>);
  }

}


export default Globe;
