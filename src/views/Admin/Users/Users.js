import React, { useState } from 'react';
// import { Row, Col, Card, CardImg, CardBody, CardTitle, Button, ButtonGroup, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap'
import Cookies from "js-cookie";
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';
import { FileUploader } from 'devextreme-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Avatar from 'react-avatar';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const cookie = Cookies.get("jwt");
const header = { 'Authorization': 'Bearer ' + cookie };


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});


const Users = (props) => {
  const classes = useStyles();
  const {
    buttonLabel,
    className,
    role
  } = props;

  const [modal, setModal] = useState(false);
  const [warningModal, setWarningModal] = useState(false);
  const [product, setProduct] = useState({
    id: '',
    NAME: '',
    UPCHARGE: '',
    UPCHARGE_THICK: '',
    TOP_RAIL_ADD: '',
    BTM_RAIL_ADD: '',
    photo: null
  });
  const [newProduct, setNewProduct] = useState(false)

  const toggle = () => {
    setModal(!modal)
  };

  const toggleWarningModal = () => {
    setWarningModal(!warningModal)
  };


  const setCard = card => {
    setNewProduct(false)
    setProduct(card)
    toggle()
  }


  const change = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setProduct((prevState) => {
      return ({
        ...prevState,
        [name]: value
      })
    })
  }


  const card = props.users.map(card => {
    return (
      <div key={card.id} className="mr-1 ml-1 flex-wrap" style={{ width: "200px" }}>
        <Card className={classes.root}>
          <CardActionArea>
            {/* <CardMedia
            className={classes.media}
            image={card.profile_picture ? card.profile_picture.url : 'https://ombud.alaska.gov/wp-content/uploads/2018/01/no-user.jpg'}
            title="Contemplative Reptile"
          /> */}
            <div style={{ margin: 'auto' }}>
              <Avatar name="Foo Bar" src={card.profile_picture ? card.profile_picture.url : 'https://ombud.alaska.gov/wp-content/uploads/2018/01/no-user.jpg'} size="150" round />
            </div>

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {card.FirstName} {card.LastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                <p>Role: {card.role.name}</p>
                <p>Username: {card.username}</p>
                <p>Email: {card.email}</p>
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  })

  return (
    <div className="container">
      <PerfectScrollbar>
        <div className="col d-flex align-content-start flex-wrap">{card}</div>
      </PerfectScrollbar>
    </div>
  )





}

const mapStateToProps = (state) => ({
  designs: state.part_list.cope_designs,
  role: state.users.user.role,
  users: state.users.registeredUsers
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
