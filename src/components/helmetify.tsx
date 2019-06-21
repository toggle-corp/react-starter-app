import React from 'react';
import Helmet from 'react-helmet';

interface Props {
    title: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const helmetify = (WrappedComponent: React.ComponentType<Props>) => (props: Props) => (
    <React.Fragment>
        <Helmet>
            <meta charSet="utf-8" />
            <title>
                {props.title}
            </title>
        </Helmet>
        <WrappedComponent
            {...props}
        />
    </React.Fragment>
);

export default helmetify;
