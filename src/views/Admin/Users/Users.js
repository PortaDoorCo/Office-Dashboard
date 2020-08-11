import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Avatar from 'react-avatar';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

<<<<<<< HEAD

=======
>>>>>>> staging
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
<<<<<<< HEAD

=======
>>>>>>> staging

  const card = props.users.map(card => {
    return (
      <div key={card.id} className="mr-1 ml-1 flex-wrap" style={{ width: '200px' }}>
        <Card className={classes.root}>
          <CardActionArea>
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
  });

  return (
    <div className="container">
      <PerfectScrollbar>
        <div className="col d-flex align-content-start flex-wrap">{card}</div>
      </PerfectScrollbar>
    </div>
  );
<<<<<<< HEAD
=======




>>>>>>> staging

};

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
