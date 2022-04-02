export function getYoutubeIdFromUrl(url: string): string {
	// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
	return url.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/)?.[1] ?? '';
}

export function embed(video: string): string {
	return `https://www.youtube.com/embed/${getYoutubeIdFromUrl(video)}`;
}
