export const SELECT_DEALS_QUERY = `
    id, 
    title,
    featured_image_url,
    rating, 
    popularity,
    final_price,
    actual_price,
    discount_percent,
    categories!inner(
        title
    ),
    deal_natures!inner(
        title
    ),
    outlets!inner(
        title
    ),
    special_offers!inner(
        title
    ),
    created_at
`

export const SELECT_DEAL_QUERY = `
    *, 
    deal_images!inner(
        image_url,
        sort_order
    ), 
    deal_additional_documents!inner(
        additional_document
    ), 
    outlets!inner(
        id,
        title,
        pincode,
        place_code,
        latitude,
        longitude
    ),
    special_offers!inner(
        id,
        title,
        weight
    ), 
    categories!inner(
        title
    ), 
    deal_natures!inner(
        id,
        title
    )
`

export const SELECT_MESSAGES_QUERY = `
    id,
    created_at,
    sender_email,
    sender_image_url,
    sender_name,
    sender_mobile_number,
    subject,
    content,
    is_archived,
    is_read,
    attachment_url,
    user_id,
    users:user_id(
        full_name
    )
`

export const SELECT_MESSAGE_THREADS_QUERY = `
    id,
    created_at,
    from_email,
    to_email,
    content,
    users!inner(
        full_name
    )
`

export const SELECT_NOTIFICATIONS_QUERY = `
    id,
    created_at,
    subject,
    content,
    is_read,
    attachment_url,
    users!inner(
        full_name
    )
`

export const SELECT_NOTIFICATION_QUERY = `
    id,
    created_at,
    receiver_id,
    subject,
    content,
    is_read,
    attachment_url,
    users!inner(
        full_name
    )
`
