
const Advaya = { Gms: { Student: { handler: { showFields: () => {}, ttWindow: () => {} } } } };
const Ext = {
  create: (cls, cfg) => cfg || {},
  String: {
    format: (format, ...args) => {
      return format;
    }
  },
  Date: {
    format: () => 'formatted_date',
    patterns: {}
  }
};
const result = ({
windowPanel :{
                modal:true
             },
            formPanel :{ 
                            bodyStyle: 'padding:5px 5px 0',
                            labelAlign: 'left',
                            labelStyle: 'font-weight:bold; font-color:red',
                            defaults: {
                                        border: false,
                                        bodyPadding: 4,
                                      }, 
                             height: 500,
                                    renderTo: 'dynacontent',
                                    items: [
                                               {
                                                xtype:'fieldset',
                                                layout : 'column',
                                                height: 34,
                                                style:{padding:0,border:0},
                                                items:[
                                                        {
                                                            xtype:'button',
                                                            cls:'studentDashboardBtn',
                                                            width : 160,
                                                            text:'<span style = "font-size:12px; font-weight: bolder; color:#FFFFFF">Attendance</span>',
                                                            id: 'semActivity',
                                                            handler:Advaya.Gms.Student.handler.showFields,
                                                                                                                        params:{
                                                                        label:'SemesterActivity'
                                                                  }
                                                        },
                                                        {
                                                            xtype:'button',
                                                            cls:'studentDashboardBtn',
                                                            width : 160,
                                                            text:'<span style = "font-size:12px; font-weight: bolder; color:#FFFFFF">Assessment Marks</span>',
                                                            id: 'assessmentMarks',
                                                            handler:Advaya.Gms.Student.handler.showFields,
                                                                                                                                                                                      params:{
                                                                   rerq:'', 
                                                                   label:'AssessmentMark',
                                                                   req:'./gemsonline-student/getAssessmentMarks.action?&'
                                                                  }
                                                        },
                                                        {
                                                            xtype:'button',
                                                            cls:'studentDashboardBtn',
                                                            width : 160,
                                                            text:'<span style = "font-size:12px; font-weight: bolder; color:#FFFFFF">Time Table</span>',
                                                            id: 'tmeTable',
                                                            handler:Advaya.Gms.Student.handler.showFields,
                                                                                                                        params:{
                                                                        label:'TimeTable'
                                                                  }
                                                        },
                                                        {
                                                            xtype:'button',
                                                            cls:'studentDashboardBtn',
                                                            width : 160,
                                                            id: 'subjDetails',
                                                            autoScroll:true,
                                                            text:'<span style = "font-size:12px; font-weight: bolder; color:#FFFFFF">Subject Details</span>',
                                                            handler:Advaya.Gms.Student.handler.showFields,
                                                                                                                        params:{
                                                                        label:'SubDetails'
                                                                  }
                                                        }
                                                   
                                                        
                                                      ]
                                               },
                                               {
                                                 xtype:'fieldset',
                                                 id:'timetableData',
                                                 height:450,
                                                 autoScroll:true,
                                                                                                  hidden:true
                                                                                                },
                                               {
                                                 xtype:'fieldset',
                                                 id:'SubDetails',
                                                                                                  hidden:true,
                                                                                                  autoScroll:true,
                                                 height:450,
                                                 items:[
                                                              {
                                                                 xtype : 'fieldset',
                                                                 layout:'anchor',
                                                                 anchor:'100%',
                                                                  padding: '0 0 0 4',
                                                                  border: false,
                                                                  componentCls: 'bottom-border-header',
                                                                  defaults : {
                                                                        labelWidth : 50,
                                                                        labelStyle : "background  : none",
                                                                        style:{ float:'left'}
                                                                        },
                                                                        items:[
                                                                                {
                                                                                    xtype: 'displayfield',
                                                                                    margin:'10 0 0 0',
                                                                                    anchor:'5%',
                                                                                    value:'<span style="color:blue;font-size:12px;"><b>S.NO</b></span>'
                                                                                }
                                                                                ,{
                                                                                    xtype: 'displayfield',
                                                                                    margin: '10 0 0 0',
                                                                                    anchor:'12%',
                                                                                    value: '<span style="color:blue;font-size:12px;"><b>CODE</b></span>'
                                                                                },
                                                                                {
                                                                                    xtype: 'displayfield',
                                                                                    margin: '10 0 0 0',
                                                                                    anchor:'28%',
                                                                                    value: '<span style="color:blue;font-size:12px;"><b>SUBJECT</b></span>'
                                                                                },
                                                                                {
                                                                                    xtype: 'displayfield',
                                                                                    margin: '10 0 0 0',
                                                                                    anchor:'28%',
                                                                                    value: '<span style="color:blue;font-size:12px;"><b>FACULTY</b></span>'
                                                                                }
                                                                                                                                                           
                                                                                ,{
                                                                                    xtype: 'displayfield',
                                                                                    margin: '10 0 0 0',
                                                                                    anchor:'15%',
                                                                                    value: '<span style="color:blue;font-size:12px;"><b>THEORY CREDITS</b></span>'
                                                                                },
                                                                                {
                                                                                    xtype: 'displayfield',
                                                                                    margin: '10 0 0 6',
                                                                                    anchor:'11%',
                                                                                    value: '<span style="color:blue;font-size:12px;"><b>LAB CREDITS</b></span>'
                                                                                }
                                                                                                                                                            
                                                                               ]
                                                            },
                                                                                                                                                                                               
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">1</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">APTITUDE</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">APTITUDE CLASSES </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> DASTHAGIRI BASHA</br>Email:<a href="mailto:drdasthagiribashak@mits.ac.in">drdasthagiribashak@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  0.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">2</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">SOFTSKILLS</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">SOFT SKILLS </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> ANANDAKUMAR</br>Email:<a href="mailto:anandakumarv@mits.ac.in">anandakumarv@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  0.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">3</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23PHY102</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">INTRODUCTION TO QUANTUM TECHNOLOGIES AND APPLICATIONS </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> CHARAN </br>Email:<a href="mailto:drcharank@mits.ac.in">drcharank@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">4</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23ENG901</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">TECHNICAL PAPER WRITING AND IPR </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> PRAVEEN KUMAR</br>Email:<a href="mailto:drpraveenkumarr@mits.ac.in">drpraveenkumarr@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  0.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">5</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM107</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">OPERATING SYSTEMS </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">  NITHIN</br>Email:<a href="mailto:Nithing@mits.ac.in">Nithing@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">6</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM108</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">COMPUTER NETWORKS </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> MANOJ KUMAR</br>Email:<a href="mailto:manojkumark@mits.ac.in">manojkumark@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">7</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM109</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">COMPUTER VISION AND IMAGE PROCESSING </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> ANNAPURNA</br>Email:<a href="mailto:annapurnas@mit.ac.in">annapurnas@mit.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">8</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM109</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">COMPUTER VISION AND IMAGE PROCESSING </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> ANNAPURNA</br>Email:<a href="mailto:annapurnas@mits.ac.in">annapurnas@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">9</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM205</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">COMPUTER NETWORKS LABORATORY </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> MANOJ KUMAR</br>Email:<a href="mailto:manojkumark@mits.ac.in">manojkumark@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  0.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  1.5 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">10</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM206</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">COMPUTER VISION LABORATORY </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> ANNAPURNA</br>Email:<a href="mailto:annapurnas@mit.ac.in">annapurnas@mit.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  0.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  1.5 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">11</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM206</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">COMPUTER VISION LABORATORY </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> ANNAPURNA</br>Email:<a href="mailto:annapurnas@mits.ac.in">annapurnas@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  0.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  1.5 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">12</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM4M02</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">INTRODUCTION TO INTERNET OF THINGS </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> NIGHITHA</br>Email:<a href="mailto:nighithav@mits.ac.in">nighithav@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">13</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM603</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">FULL STACK DEVELOPMENT II </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> SIVARAMAN </br>Email:<a href="mailto:sivaramanv@mits.ac.in">sivaramanv@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                ,
                                                                   {
                                                                         xtype : 'fieldset',
                                                                         layout:'anchor',
                                                                         anchor:'100%',
                                                                         padding: '0 0 0 4',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 50,
                                                                            style:{ float:'left'},
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                     {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'4%',
                                                                                        value : '<span style = "font-size:12px;padding: 9px">14</span>'
                                                                                    },                                                                       
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'13%',
                                                                                        value: '<span style = "font-size:12px">23CSM4M07</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px">DISTRIBUTED SYSTEMS CSM </span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        anchor:'28%',
                                                                                        value: '<span style = "font-size:12px"> ESAKKI</br>Email:<a href="mailto:esakkirajm@mits.ac.in">esakkirajm@mits.ac.in</a></br>Ext No: - </span>'
                                                                                    }
                                                                                                                                                                        
                                                                                        ,{
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'15%',
                                                                                            margin: '10 0 10 0',
                                                                                            value: '<span style = "font-size:12px;padding: 49px">  3.0 </span>'
                                                                                        },
                                                                                        {
                                                                                            xtype: 'displayfield',
                                                                                            anchor:'11%',
                                                                                            margin: '10 0 10 6',
                                                                                            value: '<span style = "font-size:12px;padding: 44px">  0.0 </span>'
                                                                                        }
                                                                                                                                                                            
                                                                               ]
                                                                      }
                                                                                                                                                                                                                                                                                       
                                                                 ]
                                               },
                                               {
                                                    xtype:'fieldset',
                                                    id:'semesterActivity',
                                                    autoScroll:true,
                                                    title:'Semester Activity for-III YEAR I SEMESTER - REGULAR ',
                                                    layout : 'anchor',
                                                    defaults: { anchor : '100%'},
                                                                                                        defaultType: 'displayfield',
                                                    height:450,
                                                    items :[
                                                              
                                                            {
                                                                 xtype : 'fieldset',
                                                                 layout : 'column',
                                                                  padding: '0 0 0 25',
                                                                  border: false,
                                                                  componentCls: 'bottom-border-header',
                                                                  defaults : {
                                                                        labelWidth : 150,
                                                                        labelStyle : "background  : none"
                                                                    },
                                                                  items:[
                                                                            {
                                                                                xtype: 'displayfield',
                                                                                margin:'5 0 0 0',
                                                                                width : 50,
                                                                                value:'<span style="color:blue;font-size:12px;"><b>S.NO</b></span>'
                                                                            },
                                                                            {
                                                                                xtype: 'displayfield',
                                                                                margin:'5 0 0 0',
                                                                                width : 150,
                                                                                value: '<span style="color:blue;font-size:12px;"><b>SUBJECT CODE</b></span>'
                                                                            },
                                                                                                                                                        {
                                                                                xtype: 'displayfield',
                                                                                margin:'5 0 0 0',
                                                                                width : 200,
                                                                                value: '<span style="color:blue;font-size:12px;"><b>CLASSES ATTENDED</b></span>'
                                                                            },
                                                                                                                                                                                                                                    {
                                                                                xtype: 'displayfield',
                                                                                margin:'5 0 0 0',
                                                                                width : 200,
                                                                                value: '<span style="color:blue;font-size:12px;"><b>TOTAL CONDUCTED</b></span>'
                                                                            },
                                                                                                                                                                                                                                    {
                                                                                xtype: 'displayfield',
                                                                                margin:'5 0 0 0',
                                                                                width : 200,
                                                                                value: '<span style="color:blue;font-size:12px;"><b>ATTENDANCE %</b></span>'
                                                                            }
                                                                       ]
                                                                },
                                                                                                                                                                                                      
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">1</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">APTITUDE</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 1 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  1 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">2</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">SOFTSKILLS</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 1 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  1 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">3</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23PHY102</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 7 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  10 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#0040FF; padding: 37px;">  70.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">4</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23ENG901</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 5 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  5 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">5</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM107</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 10 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  10 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">6</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM108</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 7 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  7 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">7</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM109</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 3 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  10 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#FF0000; padding: 37px;">  30.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">8</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM205</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 3 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  3 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">9</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM206</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 12 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  12 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  100.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">10</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM4M02</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 6 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  9 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#FFBF00; padding: 37px;">  66.67 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">11</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM603</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 6 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  7 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#04B404; padding: 37px;">  85.71 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                     ,
                                                                     {
                                                                         xtype : 'fieldset',
                                                                         layout : 'column',
                                                                         padding: '0 0 0 25',
                                                                         componentCls: 'bottom-border',
                                                                         defaults : {
                                                                            labelWidth : 150,
                                                                            labelStyle : "background  : none"
                                                                         },
                                                                         margin:'-6 0 0 0',
                                                                         items:[
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 50,
                                                                                        value : '<span style = "font-size:12px;padding: 9px;">12</span>'
                                                                                    },
                                                                                    {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 150,
                                                                                        value: '<span style = "font-size:12px">23CSM4M07</span>'
                                                                                    },
                                                                                                                                                                        {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width : 200,
                                                                                        value: '<span style = "font-size:12px;padding: 55px;"> 4 </span>'
                                                                                    },
                                                                                                                                                                                                                                                            {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                                                                                                                    value: '<span style = "font-size:12px;padding: 40px;">  8 </span>'
                                                                                                                                                                            },
                                                                                                                                                                                                                                                                                                                                                {
                                                                                        xtype: 'displayfield',
                                                                                        margin: '10 0 10 0',
                                                                                        width :200,
                                                                                        value: '<span style = "font-size:12px;color:#FF0000; padding: 37px;">  50.0 </span>'
                                                                                    }
                                                                                                                                                                   ]
                                                                      }
                                                                                                                                                                                                ,{
                                                                    xtype : 'fieldset',
                                                                    layout:'anchor',
                                                                    border: false,
                                                                    items:[
                                                                                                                                                                {
                                                                                    xtype: 'displayfield',
                                                                                    margin: '10 0 10 0',
                                                                                    anchor:'90%',
                                                                                    value : '<span style = "font-size:12px;padding: 9px;font-weight:bold">Note :</span> <span style="color:green;font-size:12px;padding: 9px;"> Green : 100%-85% </span>  <span style="color:blue;font-size:12px;padding: 9px;">Blue : 84%-70%</span><span style="color:orange;font-size:12px;padding: 9px;">Orange : 69%-59%</span><span style="color:Red;font-size:12px;padding: 9px;">Red : 58%-0%</span>'
                                                                                }
                                                                                                                                                                   
                                                                                                                                                          ]
                                                                }
                                                                                                                          ]
                                                  },
                                                  {
                                                    xtype:'fieldset',
                                                    id:'attnFldSet',
                                                    padding:'0px',
                                                    height:450,
                                                    autoScroll:true,
                                                    hidden:true
                                                  },
                                                  {
                                                    xtype:'fieldset',
                                                    id:'marksFldSet',
                                                    padding:'0px',
                                                    height:450,
                                                    width:'99%',
                                                    autoScroll:true,
                                                                                                        hidden:true
                                                                                                      }
                                            ]
                        },

tableData :{
                id:'timeTableTable',
                componentCls:"timeTableTable",
                renderTo:'dynacontent',
                                height:"92%",
                autoScroll:true,
                coldefs :[
                            { dataIndex: "days", text:"", align:'center', width:30, sortable:false, fixed:true},
                                                                                        
                                    { dataIndex: "Period1", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   09:00 AM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period2", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   10:00 AM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period3", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   11:00 AM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period4", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   12:00 PM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period5", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   02:00 PM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period6", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   03:00 PM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period7", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   04:00 PM  </span>', align:'center',  sortable:false, fixed:true}
                                                                                            ,
                                    { dataIndex: "Period8", text: '<span style="color:#007248;font-weight:bold;font-size:12px">   05:00 PM  </span>', align:'center',  sortable:false, fixed:true}
                                                                            ],
                schema : {
                    fields : [

                            "days",
                                                                                        
                                    "Period1"
                                                                                            ,
                                    "Period2"
                                                                                            ,
                                    "Period3"
                                                                                            ,
                                    "Period4"
                                                                                            ,
                                    "Period5"
                                                                                            ,
                                    "Period6"
                                                                                            ,
                                    "Period7"
                                                                                            ,
                                    "Period8"
                                                                                    ]
                },
                                   records : [
                                                                
                                {
                                                                                                                                                                    'days':'<span style="color:#007248;font-weight:bold;font-size:12px">MON</span>'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ,"Period1" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98019,"view",null)> <span style="color:#161D3F;font-family:caption">23ENG901</span></br> <span style="color:#161D3F;font-family:caption">  PRAVEEN KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period2" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,null,"view","98023,98390")><span style="color:#161D3F;font-family:caption">more than 1</span></br></a>')
                                                                                                                                                                                                                                                                                                                                                                                                                            ,"Period3" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98024,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM107</span></br> <span style="color:#161D3F;font-family:caption">   NITHIN </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period4" :''
                                                                                                                                                                                                                                                                                                                                                                        ,"Period5" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98025,"view",null)> <span style="color:#161D3F;font-family:caption">SOFTSKILLS</span></br> <span style="color:#161D3F;font-family:caption">  ANANDAKUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period6" :''
                                                                                                                                                                                                                                                    ,"Period7" :''
                                                                                                                                                                                                                                                    ,"Period8" :''
                                                                                                                                    
                                }
                                                                                                ,
                                {
                                                                                                                                                                                                            'days':'<span style="color:#007248;font-weight:bold;font-size:12px">TUE</span>'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ,"Period1" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98026,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM4M02</span></br> <span style="color:#161D3F;font-family:caption">  NIGHITHA </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period2" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98027,"view",null)> <span style="color:#161D3F;font-family:caption">APTITUDE</span></br> <span style="color:#161D3F;font-family:caption">  DASTHAGIRI BASHA </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period3" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98028,"view",null)> <span style="color:#161D3F;font-family:caption">23PHY102</span></br> <span style="color:#161D3F;font-family:caption">  CHARAN  </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period4" :''
                                                                                                                                                                                                                                                                                                                                                                        ,"Period5" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98029,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM108</span></br> <span style="color:#161D3F;font-family:caption">  MANOJ KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period6" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98043,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM603</span></br> <span style="color:#161D3F;font-family:caption">  SIVARAMAN  </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period7" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98044,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM603</span></br> <span style="color:#161D3F;font-family:caption">  SIVARAMAN  </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period8" :''
                                                                                                                                    
                                }
                                                                                                ,
                                {
                                                                                                                                                                                                                                                    'days':'<span style="color:#007248;font-weight:bold;font-size:12px">WED</span>'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ,"Period1" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,null,"view","98391,98020")><span style="color:#161D3F;font-family:caption">more than 1</span></br></a>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ,"Period2" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,null,"view","98021,98392")><span style="color:#161D3F;font-family:caption">more than 1</span></br></a>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ,"Period3" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,null,"view","98022,98393")><span style="color:#161D3F;font-family:caption">more than 1</span></br></a>')
                                                                                                                                                                                                                                                                                                        ,"Period4" :''
                                                                                                                                                                                                                                                                                                                                                                        ,"Period5" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98032,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM4M02</span></br> <span style="color:#161D3F;font-family:caption">  NIGHITHA </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period6" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98033,"view",null)> <span style="color:#161D3F;font-family:caption">23PHY102</span></br> <span style="color:#161D3F;font-family:caption">  CHARAN  </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period7" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,null,"view","98618,98619")><span style="color:#161D3F;font-family:caption">more than 1</span></br></a>')
                                                                                                                                                                                                                                                                                                        ,"Period8" :''
                                                                                                                                    
                                }
                                                                                                ,
                                {
                                                                                                                                                                                                                                                                                            'days':'<span style="color:#007248;font-weight:bold;font-size:12px">THU</span>'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        ,"Period1" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98035,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM205</span></br> <span style="color:#161D3F;font-family:caption">  MANOJ KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period2" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98036,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM205</span></br> <span style="color:#161D3F;font-family:caption">  MANOJ KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period3" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98037,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM205</span></br> <span style="color:#161D3F;font-family:caption">  MANOJ KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period4" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98617,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM107</span></br> <span style="color:#161D3F;font-family:caption">   NITHIN </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period5" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98039,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM4M07</span></br> <span style="color:#161D3F;font-family:caption">  ESAKKI </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period6" :''
                                                                                                                                                                                                                                                    ,"Period7" :''
                                                                                                                                                                                                                                                    ,"Period8" :''
                                                                                                                                    
                                }
                                                                                                ,
                                {
                                                                                                                                                                                                                                                                                                                                    'days':'<span style="color:#007248;font-weight:bold;font-size:12px">FRI</span>'
                                                                                                                                                                                                                                                                                                                                                                                                                                                ,"Period1" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98040,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM108</span></br> <span style="color:#161D3F;font-family:caption">  MANOJ KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period2" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98041,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM107</span></br> <span style="color:#161D3F;font-family:caption">   NITHIN </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period3" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98042,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM603</span></br> <span style="color:#161D3F;font-family:caption">  SIVARAMAN  </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period4" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98045,"view",null)> <span style="color:#161D3F;font-family:caption">23PHY102</span></br> <span style="color:#161D3F;font-family:caption">  CHARAN  </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period5" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98046,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM4M07</span></br> <span style="color:#161D3F;font-family:caption">  ESAKKI </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period6" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,null,"view","98395,98054")><span style="color:#161D3F;font-family:caption">more than 1</span></br></a>')
                                                                                                                                                                                                                                                                                                                                                                                                                            ,"Period7" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98057,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM4M02</span></br> <span style="color:#161D3F;font-family:caption">  NIGHITHA </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period8" :''
                                                                                                                                    
                                }
                                                                                                ,
                                {
                                                                                                                                                                                                                                                                                                                                                                            'days':'<span style="color:#007248;font-weight:bold;font-size:12px">SAT</span>'
                                                                                                                                                                                                                                                                                                                                                                                                        ,"Period1" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98047,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM4M07</span></br> <span style="color:#161D3F;font-family:caption">  ESAKKI </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period2" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98048,"view",null)> <span style="color:#161D3F;font-family:caption">23CSM108</span></br> <span style="color:#161D3F;font-family:caption">  MANOJ KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ,"Period3" : Ext.String.format('<a href="#"  onmouseover=Advaya.Gms.Student.handler.ttWindow(this,98049,"view",null)> <span style="color:#161D3F;font-family:caption">23ENG901</span></br> <span style="color:#161D3F;font-family:caption">  PRAVEEN KUMAR </span></br></a> <span style="color:#786D5F;font-size:10px;"></span><span style="color:#786D5F;font-size:10px;margin-left:30%"></span>')
                                                                                                                                                                                                                                                                                                                                                                  ,"Period4" :''
                                                                                                                                                                                                                                                    ,"Period5" :''
                                                                                                                                                                                                                                                    ,"Period6" :''
                                                                                                                                                                                                                                                    ,"Period7" :''
                                                                                                                                                                                                                                                    ,"Period8" :''
                                                                                                                                    
                                }
                                                                                             ]
            },
attendanceTable:{
        id:"stuAttendncTbl",
        autoScroll:true,
        width:"90%",
        height:"100%",
        componentCls:"attReportGrid",
        renderTo:'dynacontent',
        coldefs :[
        Ext.create('Ext.grid.RowNumberer',{locked:true, width:30}),
        { dataIndex: "subjectName", text: 'SUBJECT NAME' , width:150, sortable:false , locked:true},
        { dataIndex: "subjectCode", text: "CODE", locked:true, width:80},
                        ],
        schema :
            {
                fields : ["id","subjectName","subjectCode",
                                                                                 ]
             },
                     records:[
                     ]     
}
  }
);
module.exports = result;
