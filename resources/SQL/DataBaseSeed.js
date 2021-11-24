module.exports = { seed: `
	drop table if exists pictures;
	drop table if exists videos;
	drop table if exists threads;	
	drop table if exists post;
	drop table if exists authentication;
	drop table if exists post;
	drop table if exists users;
	
				
	CREATE TABLE users (
		user_id SERIAL PRIMARY KEY,
		first_name varchar(50) NOT NULL,
		last_name varchar(50) NOT NULL,
		email varchar(40) NOT NULL UNIQUE,
		password_hash VARCHAR(80) NOT NULL,
		bio varchar(800)
	);

	


CREATE TABLE post (
	post_id SERIAL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	post_type INTEGER NOT NULL,
	likes INTEGER NOT NULL,
	caption varchar(800) NOT NULL,
	post_views INTEGER NOT NULL,
	game_id INTEGER NOT NULL,
	threads varchar NOT NULL,
	content_id INTEGER NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE pictures (
	picture_id SERIAL PRIMARY KEY,
	image_src varchar NOT NULL
);

CREATE TABLE videos (
	video_id SERIAL PRIMARY KEY,
	video_src varchar NOT NULL
);

CREATE TABLE threads (
	thread_id SERIAL PRIMARY KEY,
	thread_name varchar(255) NOT NULL,
	game_id INTEGER NOT NULL,
	description varchar(255) NOT NULL
);`
}








