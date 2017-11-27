import React from 'react';
import ReactDOM from 'react-dom';

class Globe extends React.Component{


    constructor(props){
        super(props);
        this.state={ globe_data:null };
        this.globe=null;
        this.bubble_map = null;

    }
    redraw= function() {
              console.log('Redraw');
              this.bubble_map.svg.select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');
              this.rescaleWorld();
              this.rescaleBubbles();
        }.bind(this);

    rescaleWorld= function () {
          this.bubble_map.svg.selectAll('g').attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
     }.bind(this);
    rescaleBubbles= function () {
          var bubbleRadius = 4;
          var bubbleBorder = 15;
          this.bubble_map.svg.selectAll('.datamaps-bubble').attr('r', bubbleRadius / d3.event.scale); 
    }.bind(this);
    componentDidMount(){
         this.bubble_map = new Datamap({element: document.getElementById('globe_div'),
                        fills: {
                            defaultFill: '#ABDDA4',
                            'b1': '#2b8a1e',
                            'b2': 'blue',
                            'b3': 'orange',
                            'b4': 'red'
                        } ,
                        bubblesConfig: {
                            borderWidth: 0,
                        },
         });
         this.zoom=new Zoom({
            $container: $('#globe_div'),
            datamap: this.bubble_map,
         });
         this.bubble_map.svg.call(d3.behavior.zoom().on('zoom', this.redraw));
    }
    componentWillMount() {
            // Do the Ajax Query Here

        $.ajax({ 'url': 'https://chetan-techjam.deploy.akamai.com/cgi/handle_globe_data.cgi',
                'success': function (data) {
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
                    globe_data.push({ 'name': name, 'radius':6, 'city': city, 'country':country, 'latitude':lat, 'longitude':lon, 'b1':b1, 'b2':b2, 'b3':b3, 'b4':b4, 'fillKey':fillkey  });
                }
                this.setState({'globe_data':globe_data });
            }.bind(this)
        });        

    }

    componentDidUpdate () {
        if ( this.state.globe_data != null  ) {
            this.bubble_map.bubbles(this.state.globe_data,{
                popupTemplate: function(geo, data) {
                    return '<div class="hoverinfo">' + data.name + ', ' + data.city + ','  + data.country + '<br/>B1:'+data.b1 +'<br/>B2:'+data.b2+'<br/>B3:'+data.b3+'<br/>B4:'+data.b4
                }
            });
        }
  }

  render(){
        return(<div id='globe_div' ref={(input)=>this.globe_div=input} style={{"height":"500px"}} ></div>);
  }

}


export default Globe;
