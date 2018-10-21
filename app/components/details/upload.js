/*
 * Created by jhuang on 2018/3/19.
 */
import React, { Component } from "react"
import { Link, hashHistory } from "react-router"
import {Button, Modal, Upload,Icon,message} from 'antd'
import { observer, inject } from 'mobx-react'

@inject('listStore') @observer
class MyModal extends Component{
       constructor(props){
       super(props);
       this.state = {
          
       }
      }
      handleOk = () => {
        const {listStore} = this.props;
        listStore.isShowModal = false;
      }
      handleCancel = () => {
        const {listStore} = this.props;
        listStore.isShowModal = false;
      }
    render(){
        const Dragger = Upload.Dragger; 
         //upload的参数
        const props = {
          name: 'file',
          action: '/api/file/upload',
          showUploadList:true,
          headers: {
               token:localStorage.getItem('token')
          },
          multiple:true,
          beforeUpload(file) {
              //上传文件之前的钩,返回是一个promise对象
              let fileName = file.name;
              let file_typename = fileName.substring(fileName.lastIndexOf('.')+1,fileName.length);
              const maxsize = 20*1024*1024;//2M 
              if (file.size > maxsize) {
                  message.error('对不起，您只能上传2M以内大小的文件！');
                  return false;
              }
              if(file_typename != 'xlsx' &&  file_typename != 'xls' && file_typename != 'txt' && 
                file_typename != 'pdf' && file_typename != 'docx' && file_typename != 'doc'){
                message.error('只能上传Excel,TXT,PDF,Word类型的文件');
                return false;
              }
          },
          onChange(info) {
            //   console.log(info);
              if(info.file.status === 'done' && info.file.response.success){
                 message.success(`${info.file.name}文件上传成功。`);
              }else if(info.file.status === 'error'){
                 message.error(`${info.file.name}文件解析发生错误或者文件格式发生错误`);
              }
          },
        };
        const {listStore} = this.props;
        const isVisible = listStore.isShowModal;
        return(
            <div>
            <Modal 
            title="添加文件(支持Excel,TXT,PDF,Word文件)"
            visible={isVisible}
            okText={'确定'}
            cancelText={'取消'}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            >
              <div className="uploadContainer" style={{ width: 246, height: 140 }}>
               <Dragger {...props}>
               <Icon type=""/> 
               </Dragger> 
               </div>
            </Modal>
          </div>
        )
    }


}
export default MyModal