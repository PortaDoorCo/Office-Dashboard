import React, { Component, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import db_url from '../../redux/db_url';
const cookie = Cookies.get('jwt');
const header = { Authorization: 'Bearer ' + cookie };


const FileUploader = (props) => {

  const uploadProps = {
    name: 'file',
    multiple: props.multi,
    action: `${db_url}/upload`,
    customRequest: (options) => {
      console.log(options);
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
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
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
