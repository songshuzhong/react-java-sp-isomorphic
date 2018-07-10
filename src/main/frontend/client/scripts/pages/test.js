import  react, {Component} from 'react';
import {Container, Row,Form,Input} from 'epm-ui';
import {ServiceAddDivider} from '../components/service-register/divider'
class TestStudy extends Component {
    render() {
        return(
            <Container type="fluid">
                <Row>
                    <Form>
                        <ServiceAddDivider/>
                        <Input type="text" value="111"/>
                    </Form>
                </Row>
                <Row>3</Row>
                <Row>2</Row>
            </Container>
        );
    }
}
export  {TestStudy};
export  default {TestStudy};