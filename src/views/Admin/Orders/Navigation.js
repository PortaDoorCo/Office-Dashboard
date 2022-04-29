import { IconButton } from '@material-ui/core';
import React from 'react';
import { Col } from 'reactstrap';
import Tooltip from '@material-ui/core/Tooltip';
import Edit from '@material-ui/icons/Edit';
import List from '@material-ui/icons/List';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Dns from '@material-ui/icons/Dns';
import Chat from '@material-ui/icons/Chat';
import Attachment from '@material-ui/icons/Attachment';

const Navigation = (props) => {
  console.log({ props });

  if (
    props.user?.role?.type !== 'quality_control' &&
    props.user?.role?.type !== 'sales'
  ) {
    return (
      <Col>
        <Tooltip title="Edit" placement="top">
          <IconButton onClick={props.editable}>
            <Edit style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Tracking History" placement="top">
          <IconButton onClick={props.toggleTracking}>
            <List style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Balance" placement="top">
          <IconButton onClick={props.toggleBalance}>
            <AttachMoneyIcon style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Misc Items" placement="top">
          <IconButton onClick={props.toggleMiscItems}>
            <Dns style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Notes" placement="top">
          <IconButton onClick={props.toggleNotes}>
            <Chat style={{ width: '40', height: '40' }} />
          </IconButton>
        </Tooltip>
        {!props.edit ? (
          <Tooltip title="View Files" placement="top">
            <IconButton onClick={props.toggleFiles}>
              <Attachment style={{ width: '40', height: '40' }} />
            </IconButton>
          </Tooltip>
        ) : null}
      </Col>
    );
  } else {
    return null;
  }
};

export default Navigation;
