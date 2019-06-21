import PropTypes from 'prop-types';
import React from 'react';
import { Link } from '@reach/router';
import { _cs } from '@togglecorp/fujs';

import ListView from '#rscv/List/ListView';

import { routeSettings } from '#constants';

import styles from './styles.scss';

const pages = routeSettings.filter(setting => !!setting.navbar);

const MenuItem = ({
    className,
    title,
    link,
    // routeKey,
    disabled,
}) => {
    if (disabled) {
        return (
            <div
                className={
                    _cs(
                        className,
                        styles.menuItem,
                        // routeKey === link && styles.selected,
                        disabled && styles.disabled,
                    )
                }
            >
                <div className={styles.menuTitle}>
                    {title}
                </div>
            </div>
        );
    }

    const getProps = ({ isCurrent }) => ({
        className: _cs(
            className,
            styles.menuItem,
            isCurrent && styles.active,
            disabled && styles.disabled,
        ),
    });

    return (
        <Link
            to={link}
            getProps={getProps}
        >
            <div className={styles.menuTitle}>
                {title}
            </div>
        </Link>
    );
};

MenuItem.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};
MenuItem.defaultProps = {
    className: '',
    disabled: false,
};

const propTypes = {
    className: PropTypes.string,
};

const defaultProps = {
    className: '',
};

class Navbar extends React.PureComponent {
    static propTypes = propTypes;
    static defaultProps = defaultProps;

    static menuKeySelector = d => d.name;

    menuRendererParams = (key, data) => ({
        title: data.title,
        link: data.path,
        disabled: data.disabled,
    });

    render() {
        const {
            className: classNameFromProps,
        } = this.props;

        const className = _cs(
            classNameFromProps,
            styles.navbar,
        );

        return (
            <nav className={className}>
                <div className={styles.menu}>
                    <ListView
                        data={pages}
                        keySelector={Navbar.menuKeySelector}
                        renderer={MenuItem}
                        rendererParams={this.menuRendererParams}
                        className={styles.menuItems}
                    />
                </div>
            </nav>
        );
    }
}

export default Navbar;
