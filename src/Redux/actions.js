import axios from 'axios';
import Swal from "sweetalert2";
export const GET_SUPLEMENTS_BY_NAME = "GET_SUPLEMENTS_BY_NAME";
export const NOT_GET_SUPLEMENT_BY_NAME = "NOT_GET_SUPLEMENT_BY_NAME";
export const POST_SUPLEMENTS = "POST_SUPLEMENTS";
export const GET_SUPLEMENT = "GET_SUPLEMENT";
export const GET_SUPLEMENTS = "GET_SUPLEMENTS";
export const CLEAN_PRODUCT_BY_ID = "CLEAN_PRODUCT_BY_ID";

export const PAYMENT_ID = "PAYMENT_ID";
export const ADD_TO_CART = 'ADD_TO_CART';
export const INJECT_CART_DATA = 'INJECT_CART_DATA'
export const SHOW_SHOPPING_CART = 'SHOW_SHOPPING_CART';
export const REMOVE_ONE_FROM_CART = 'REMOVE_ONE_FROM_CART';
export const REMOVE_ALL_FROM_CART = 'REMOVE_ALL_FROM_CART,';
export const POST_REGISTER_USER = "POST_REGISTER_USER";

export const POST_LOGIN = "POST_LOGIN";
export const USER = "USER";
export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_PROVIDERS = "GET_PROVIDERS";
export const GET_TAGS = "GET_TAGS";

//Función que hace la peticion con axios al back-end
//para traer todos los suplementos
export const getCategorias = () => {
    return async function (dispatch) {
        const response = await axios.get('/category')
        return dispatch({
            type: GET_CATEGORIES,
            payload: response.data
        })
    }
}
export const getProviders = () => {
    return async function (dispatch) {
        const response = await axios.get('/provider')
        return dispatch({
            type: GET_PROVIDERS,
            payload: response.data
        })
    }
}
export const getTags = () => {
    return async function (dispatch) {
        const response = await axios.get('/tags')
        return dispatch({
            type: GET_TAGS,
            payload: response.data
        })
    }
}

export const getSuplements = () => {
    return async function (dispatch) {
        const response = await axios.get('/suplements')
        return dispatch({
            type: GET_SUPLEMENTS,
            payload: response.data
        })
    }
}



export const postSuplements = (newSuplements) => {

    return async function (dispatch) {
        try {
            await axios.post("/suplements", newSuplements).then(({data})=>{
                Swal.fire({
                    icon: "success",
                    title: "Suplemento registrado!",
                    text: "registrado correctamente",
                  });
                return dispatch({
                    type: POST_SUPLEMENTS,
                    payload: response.data
                });
            })
        }
        catch (error) {
            console.log('error al registrar los datos', error);
        }
    };
};


// NO ESTA EN USO 
export function paymentGateway(cart) {
    // console.log();
    return async function (dispatch) {
        try {

            const items = cart.map((prod) => ({
                title: prod.name,
                price: parseFloat(prod.price),
                quantity: parseInt(prod.quantity),
                productId: prod.id,
            }));
            // console.log(items);
            const total = cart.map((prod) => prod.total)
            let totalPrice = 0;

            for (let i = 0; i < total.length; i++) {
                totalPrice += total[i];
            }
            //almacenar el user en el localstorage
            // const valueLocal = JSON.parse(localStorage.getItem("user"))

            // const cartDB = {
            //     // idUserLocal: valueLocal.id,
            //     cartItems: cart.map((prod) => ({
            //         name: prod.name,
            //         productId: prod.id,
            //         price: parseFloat(prod.price),
            //         quantity: parseInt(prod.quantity),
            //     })),
            //     total: totalPrice,
            //     paymentMethod: "mercadopago"
            // }

            //  ALMACENANDO EL CARRITO EN LA BDD
            // const postCart = axios.post("/cart", cartDB)

            const response = await axios.post("/payment/create_preference", {
                items: items,
                total: totalPrice,
            })

            const { id } = response.data;
            return id;
            // dispatch({ type: PAYMENT_ID, payload: id })
            //eliminando los prod del carrito en el localStor cuando la compra se completa con exito
            window.localStorage.removeItem('cart')
        } catch (error) {
            console.log('error obteniendo la orden de pago', error);
        }
    }
}

export const showShoppingCart = (data) => {
    return {
        type: SHOW_SHOPPING_CART,
        payload: data
    }
}

export const addToCart = (id) => {
    // console.log('add to cart', id)
    return {
        type: ADD_TO_CART,
        payload: id
    }
}

export const removeOneFromCart = (id) => {
    console.log('remove one to cart', id)
    return {
        type: REMOVE_ONE_FROM_CART,
        payload: id
    }
}

export const removeFromCart = (id) => {
    console.log(id)
    return {
        type: REMOVE_ALL_FROM_CART,
        payload: id
    }
}

export const injectCartData = (data) => {
    return {
        type: INJECT_CART_DATA,
        payload: data
    }
}

export const postRegisterUser = (user) => {
    const endpoint = '/users';
    return async function (dispatch) {
        try {
            const response = await axios.post(endpoint, user);
            return dispatch({
                type: POST_REGISTER_USER,
                payload: response.data
            });
        }
        catch (error) {
            console.log('error al registrar los datos', error);
        }
    }
};

export const getSuplement = (id) => {
    return async function (dispatch) {
        try {
            const { data } = await axios.get(`/suplements/${id}`);
            console.log(data)
            return dispatch({
                type: GET_SUPLEMENT,
                payload: data,
            });
        } catch (error) {
            console.log(error)
        }
    };
};

export const cleanProductById = () => {
    return {
        type: CLEAN_PRODUCT_BY_ID,
        payload: {}
    }
}

//Función que hace la peticion con axios al back-end
//para traer suplementos por nombre
export const getSuplementsByName = (queryParams) => {
    return async function (dispatch) {
        const response = await axios.get(`/suplements?name=${queryParams}`)
        //console.log(response.data)

        if (Array.isArray(response.data)) {
            return dispatch({
                type: GET_SUPLEMENTS_BY_NAME,
                payload: response.data
            })
        } else {
            return dispatch({
                type: NOT_GET_SUPLEMENT_BY_NAME,
                payload: response.data
            })
        }
    }
}

export const fetchSuplementById = (id) => async dispatch => {
    try {
        const response = await axios.get(`/suplements/${id}`);
        dispatch({ type: 'FETCH_SUPLEMENT_BY_ID_SUCCESS', payload: response.data });
    } catch (error) {
        console.log(error);
    }
};

export const updateSuplement = (formData) => async dispatch => {
    try {
        const response = await axios.put(`/suplements`, formData);
        dispatch({ type: 'UPDATE_SUPLEMENT_SUCCESS', payload: response.data });
    } catch (error) {
        console.log(error);
    }
};
``
export const postLogin = (login) => {
    const endpointRegisterUser = '/login';
    return async function (dispatch) {
        try {
            const response = await axios.post(endpointRegisterUser, login);
            return dispatch({
                type: POST_LOGIN,
                payload: response.data
            });
        }
        catch (error) {
            console.log('error al log in', error);
            alert("error" + error);
        }
    };
};

export const setUser = (user) => ({
    type: USER,
    payload: user,
});
