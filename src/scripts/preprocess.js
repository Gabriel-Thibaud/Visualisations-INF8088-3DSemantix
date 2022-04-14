import "babel-polyfill";
/**
 *  @returns {Promise<Object[]>}  the data with all the details (orders, parts, similarGeometries)
 */


export async function getData() {
    try {
        const json = await fetch("https://pfosaomareastus2.blob.core.windows.net/samuel/VisualisationPoly/Dataset%20A%20-%202022-02-15.json?sv=2020-04-08&st=2022-02-15T19%3A41%3A21Z&se=2022-04-30T18%3A41%3A00Z&sr=b&sp=r&sig=QsR44Y79YEhGR63OaygjFQExZlGA5WMaXya0597KEZI%3D");
        return await json.json();
    }
    catch (e) {
        throw new Error('An error occurred: ' + e.message);
    }
}

/**
 * @returns {Promise<Number[]>} the data with the details about the orders quantity
 */
async function getInfoOrders() {
    const infoOrders = [];
    const orders = await getData();
    orders.Orders.forEach((order) => {
        let counter = 0;
        order.Builds.forEach((build) => {
            build.BuiltParts.forEach((part) => {
                counter += part.Quantity
            })
        })
        infoOrders.push(counter);
    });
    return infoOrders;
}

/**
 * @returns {Promise<Object[]>} the data with the details about the number of orders and the quantity
 */
export async function getOccurrenceOrder() {
    const orders = await getInfoOrders()
    const orderAndQuantity = {}
    orders.forEach((order) => {
        orderAndQuantity[order] = (orderAndQuantity[order] || 0) + 1
    })
    return Object.entries(orderAndQuantity)
}