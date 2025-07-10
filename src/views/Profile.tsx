import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Highlight from '../components/utils/Highlight';
import Loading from '../components/utils/Loading';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';

interface User {
  picture: string;
  name: string;
  email: string;
}

export const ProfileComponent: React.FC = () => {
  const { user } = useAuth0();

  // TypeScript guard to ensure user is not undefined
  if (!user) return <Loading />;

  const typedUser = user as User;

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={typedUser.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{typedUser.name}</h2>
          <p className="lead text-muted">{typedUser.email}</p>
        </Col>
      </Row>
      <Row>
        <Highlight>{JSON.stringify(typedUser, null, 2)}</Highlight>
      </Row>
    </Container>
  );
};

// Wrap the component with authentication requirement
export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
