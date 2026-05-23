'use server'

import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

export const createComment = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const commentingUserID = data?.user?.id

	const itemId = formData.get('item-id') as string
	const comment = formData.get('comment') as string

	const commentPromise = supabase
		.from('item_comments')
		.insert({ item_id: itemId, comments: comment, user_id: commentingUserID })
		.select('*,user:user_id(user_id, display_name),listItem:list_items!item_comments_item_id_fkey(title,list_id,user_id)')
		.single()

	const [resp] = await Promise.all([commentPromise])

	const comm = resp.data

	console.log(JSON.stringify(comm, null, 2))

	return {
		status: 'success',
		comm,
	}
}

export const editComment = async (prevState: any, formData: FormData) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	// const id = formData.get('id') as string
	// const title = formData.get('title') as string
	// const url = formData.get('url') as string
	// const notes = formData.get('notes') as string
	// const priority = formData.get('priority') || (ItemPriority.Normal as string)
	// const scrape = formData.get('scrape') as string
	// const imageUrl = formData.get('image-url') as string

	// const itemPromise = await supabase
	// 	.from('item_comments')
	// 	.update([{ title, url, notes, priority, image_url: imageUrl, scrape: JSON.parse(scrape) }])
	// 	.eq('id', id)

	// const [item] = await Promise.all([
	// 	itemPromise,
	// 	//
	// 	// new Promise(resolve => setTimeout(resolve, 5000)),
	// ])

	return {
		status: 'success',
		// item,
	}
}

export const deleteComment = async (commentId: number) => {
	'use server'
	try {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)

		const itemPromise = supabase.from('item_comments').delete().eq('id', commentId)

		const temp = await Promise.all([
			itemPromise,
			// new Promise(resolve => setTimeout(resolve, 5000)),
		])

		// console.log('deleteComment', { temp, commentId })

		return {
			status: 'success',
		}
	} catch (error) {
		return {
			status: 'error',
		}
	}
}

export const getCommentsGroupedByItem = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	try {
		const resp = await supabase
			.from('item_comments')
			.select(
				`item_id,
				created_at,
				listItem:view_sorted_list_items!item_comments_item_id_fkey(
					*,
					user:users!list_items_user_id_fkey1(user_id, display_name),
					list:lists!list_items_list_id_fkey(id, name, recipient_user_id, private, active),
					item_comments!item_comments_item_id_fkey(
						id,
						item_id,
						comments,
						created_at,
						edited_at,
						archived,
						user:user_id(user_id, display_name)
					)
				)`
			)
			.is('listItem.list.private', false)
			.is('listItem.item_comments.archived', false)
			.order('created_at', { ascending: false })
			.then(async items => {
				const temp = items?.data as any

				const uniqueArray = temp?.reduce((acc, current) => {
					if (!acc.some(obj => obj.item_id === current.item_id)) {
						if (current.listItem?.list?.active && !current.listItem?.list?.private) {
							acc.push(current)
						}
					}
					return acc
				}, [])

				return {
					...items,
					data: uniqueArray,
				}
			})

		// console.log('getCommentsGroupedByItem.resp', resp)

		return resp as any
	} catch (error) {
		console.error('getCommentsGroupedByItem.resp.error', error)
	}
}
