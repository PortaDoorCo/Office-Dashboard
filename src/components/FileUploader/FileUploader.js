import React, { Component, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import db_url from '../../redux/db_url';
import { NotificationManager } from 'react-notifications';
const cookie = Cookies.get('jwt');
const header = { Authorization: 'Bearer ' + cookie };


const FileUploader = (props) => {

  const uploadProps = {
    name: 'file',
    multiple: props.multi,
    action: `${db_url}/upload`,
    customRequest: (options) => {
      const data= new FormData();
      data.append('files', options.file);
      const config= {
        'headers': {
          'content-type': 'multipart/form-data',
          Authorization: 'Bearer ' + cookie
        }
      };
      axios.post(options.action, data, config).then((res) => {
        options.onSuccess(res.data, options.file);
        props.onUploaded(res.data);
      }).catch((err) => {
        NotificationManager.error('There was an problem with your upload', 'Error', 2000);
        console.log(err);
      });
			
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        NotificationManager.success('File Successfully Uploaded!', 'Success', 2000);
      } else if (info.file.status === 'error') {
        NotificationManager.error('There was an problem with your upload', 'Error', 2000);
      }
    },
  };

  return (
    <div>
      <Upload {...uploadProps}>
        <Button>
          <UploadOutlined /> Click to Upload
        </Button>
      </Upload>
    </div>
  );
};

export default FileUploader;
