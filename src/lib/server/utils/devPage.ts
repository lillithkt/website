import { error } from "@sveltejs/kit";

/**
 * Throws a 404 error if the page is not in development
 * @param message Overwrite the default message
 * @param code Overwrite the default code
 */
export default function devPage(message: string = "This page is still being worked on!", code: number = 404) {
  if (!import.meta.env.DEV) error(code, message)
}