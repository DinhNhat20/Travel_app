import axios from 'axios';

const BASE_URL = 'http://192.168.1.16:8000/';

export const endpoint = {
    login: '/o/token/',
    'current-user': '/users/current-user/',
    'create-service': '/services01/',
    services02: (service_id) => `/services/${service_id}/`,
    services: (q, service_type, page, province, sort) =>
        `/services/?q=${q}&service_type=${service_type}&page=${page}&province=${province}&sort=${sort}`,
    'services-of-provider': (q, page, provider, sort) =>
        `/services/?q=${q}&page=${page}&provider=${provider}&sort=${sort}`,
    images: '/images/',
    'create-image': '/images/',
    'service-schedules': (service_id) => `/service-schedules/?service=${service_id}`,
    customers: '/customers/',
    'update-customer': (customer_id) => `/customers/${customer_id}/`,
    providers: '/providers/',
    'update-provider': (provider_id) => `/providers/${provider_id}/`,
    serviceTypes: '/service-types/',
    discounts: 'discounts',
    'service-schedules01': '/service-schedules/',
    booking: '/bookings/',
    'update-booking': (booking_id) => `/bookings/${booking_id}/`,
    'booking-list': (schedule_id, page) => `/bookings/?service_schedule=${schedule_id}&page=${page}`,
    momo: '/payment/',
    zalo: '/zalo/payment/',
    provinces: '/provinces/',
    'service-types': '/service-types/',
    images: (service) => `/images/?service=${service}`,
    'delete-image': (id) => `/images/${id}/`,
    'delete-service-schedule': (schedule_id) => `/service-schedules/${schedule_id}/`,
    'update-service-schedule': (schedule_id) => `/service-schedules/${schedule_id}/`,
    'customers-by-schedule': (schedule_id) => `/customers-by-schedule/${schedule_id}/`,
    'monthly-revenue': (provider_id, month, year) =>
        `/revenue/${provider_id}/monthly-revenue/?month=${month}&year=${year}`,
    'yearly-revenue': (year) => `/revenue/yearly-revenue/?year=${year}`,
    'customer-bookings': (customer_id, page) => `/bookings/customer-bookings/?customer_id=${customer_id}&page=${page}`,
    'customer-bookings-notyetpaid': (customer_id, page) =>
        `/bookings/customer-bookings-notyetpaid/?customer_id=${customer_id}&page=${page}`,
    'bookings-history': (customer_id, page) => `/bookings/bookings-history/?customer_id=${customer_id}&page=${page}`,
    reviews: '/reviews/',
    'service-reviews': (service_id, page) => `/reviews/service-reviews/?service_id=${service_id}&page=${page}`,
    'provider-reviews': (provider_id) => `/providers/${provider_id}/all-reviews/`,
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
