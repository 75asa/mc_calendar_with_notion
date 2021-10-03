import { notion, databaseId } from '../config/index.js'
import { DatePropertyValue, TitlePropertyValue, Page } from '@notionhq/client/build/src/api-types'
import { UnknownHTTPResponseError } from "@notionhq/client"
import dayjs from 'dayjs'

/**
 * ページの一覧を取得
 * @returns Pageの配列
 */
export const queryPages = async (): Promise<Page[]> => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId != null ? databaseId : "",
            sorts: [
                {
                    property: "Clone",
                    direction: "ascending"
                },
                {
                    property: "Date",
                    direction: "ascending"
                }
            ]
        });
        const pages = response.results.map(result => {
            return result
        })
        return pages
    } catch (error) {
        if (error instanceof UnknownHTTPResponseError) {
            console.log(error.body)
        }
        throw error
    }
}

/**
 * 複製されたページの一覧を取得
 * @returns 
 */
export const queryClonePage = async (): Promise<Page[]> => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId ? databaseId : '',
            filter: {
                property: "Clone",
                checkbox: {
                    equals: true
                }
            }
        })
        return response.results
    } catch (error) {
        if (error instanceof UnknownHTTPResponseError) {
            console.log(error.body)
        }
        throw error
    }
}

/**
 * 次回の日直を取得
 * @returns 次回日直のページオブジェクト
 */
export const queryNextMC = async (today: string): Promise<Page> => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId != null ? databaseId : "",
            sorts: [
                {
                    property: "Date",
                    direction: "ascending"
                }
            ]
        });
        let target = response.results[0] // 初期値
        response.results.some((result) => {
            // 今日から直近の平日を日直として変数に代入
            const targetDate = dayjs((result.properties.Date as DatePropertyValue).date?.start)
            const duration = dayjs(today).diff(targetDate, 'day')
            if (duration < 0) {
                target = result
                return true
            }
            return false
        })
        return target
    } catch (error) {
        if (error instanceof UnknownHTTPResponseError) {
            console.log(error.body)
        }
        throw error
    }
}
