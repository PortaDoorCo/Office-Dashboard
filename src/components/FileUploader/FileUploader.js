import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Row, Col} from 'reactstrap';
import { Upload, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import db_url from '../../redux/db_url';
import { NotificationManager } from 'react-notifications';
const cookie = Cookies.get('jwt');

const FileUploader = (props) => {

  const [fileName, setFileName] = useState(null);
  const [fileList, setFileList] = useState([]);

  const changeName = e => {
    setFileName(e.target.value);
  };

  const uploadProps = {
    name: fileName,
    listType: 'picture',
    defaultFileList: [...fileList],
    multiple: props.multi,
    action: `${db_url}/upload`,
    customRequest: (options) => {
      const data= new FormData();
      data.append('files', options.file, fileName ? fileName : options && options.file && options.file.name );
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
    fileList: fileList,
    onChange(info) {


      info.file.name = fileName ? fileName : info.file.name;
      
      setFileList(info.fileList);
  
  
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        NotificationManager.success('File Successfully Uploaded!', 'Success', 2000);
        setFileName('');

        setFileList(
          fileList.map(item => 
            item.uid === info.file.uid 
              ? {...info.file, url: info.file.response[0].url} 
              : item 
          ));

      } else if (info.file.status === 'error') {
        NotificationManager.error('There was an problem with your upload', 'Error', 2000);
      }
    } 
      
    
  };


  return (
    <div>

      <Row>
        <Col>
          <Input placeholder={'Filename'} value={fileName} onChange={(e) => changeName(e)} />
        </Col>
        <Col lg='7' />
      </Row>

      <Row>
        <Col>
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined /> Click to Upload
            </Button>
          </Upload>
        </Col>
      </Row>

    </div>
  );
};

export default FileUploader;
