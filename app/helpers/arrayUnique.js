const getNamespaceCheck = props => item => {
    try {
        let namespace = false;
        props.forEach(propName => {
            if (!item[propName]) {
                throw new Error(`Item does not have property ${propName}`);
            }
            namespace += item[propName];
        });
        return namespace;
    } catch (error) {
        throw new Error(error);
    }
};

const getItemProps = props => item => {
    try {
        const result = {};
        props.forEach(propName => {
            if (!item[propName]) {
                throw new Error(`Item does not have property ${propName}`);
            }
            result[propName] = item[propName];
        });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = props => (data, allProps = false) => {
    const namespaceCheck = getNamespaceCheck(props);
    const itemProps = getItemProps(props);

    const uniques = {};
    data.forEach(item => {
        const namespace = namespaceCheck(item);
        if (namespace && !uniques[namespace]) {
            if (allProps) {
                uniques[namespace] = { ...item };
            } else {
                uniques[namespace] = itemProps(item);
            }
        }
    });
    
    const result = [];
    for (let namespace in uniques) {
        result.push(uniques[namespace]);
    }
    return result;
};
