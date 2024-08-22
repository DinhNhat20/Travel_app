import axios from 'axios';

const BASE_URL = 'http://192.168.1.8:8000/';

export const endpoint = {
    login: '/o/token/',
    'current-user': '/users/current-user/',
    services01: '/services/',
    services02: (service_id) => `/services/${service_id}/`,
    services: (q, service_type, page, province, sort) =>
        `/services/?q=${q}&service_type=${service_type}&page=${page}&province=${province}&sort=${sort}`,
    'services-of-provider': (q, page, provider, sort) =>
        `/services/?q=${q}&page=${page}&provider=${provider}&sort=${sort}`,
    images: '/images/',
    'service-schedules': (service_id) => `/service-schedules/?service=${service_id}`,
    customers: '/customers/',
    providers: '/providers/',
    serviceTypes: '/service-types/',
    discounts: 'discounts',
    'service-schedules01': '/service-schedules/',
    booking: '/bookings/',
    momo: '/payment/',
    zalo: '/zalo/payment/',
    provinces: '/provinces/',
    'service-types': '/service-types/',
    images: (service) => `/images/?service=${service}`,
};

export const authAPI = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export default axios.create({
    baseURL: BASE_URL,
});
