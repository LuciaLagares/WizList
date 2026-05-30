CREATE DATABASE IF NOT EXISTS wizlist;
USE wizlist;

CREATE TABLE IF NOT EXISTS `user` (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(80) NOT NULL,
    password VARCHAR(256) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'normal',
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_username (username)
)

CREATE TABLE IF NOT EXISTS `character` (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    house VARCHAR(50),
    image VARCHAR(260),
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS `spell` (
    id VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS `character_spells` (
    character_id VARCHAR(100) NOT NULL,
    spell_id VARCHAR(100) NOT NULL,
    PRIMARY KEY (character_id, spell_id),
    CONSTRAINT fk_cs_character FOREIGN KEY (character_id) REFERENCES `character`(id) ON DELETE CASCADE,
    CONSTRAINT fk_cs_spell FOREIGN KEY (spell_id) REFERENCES `spell`(id) ON DELETE CASCADE
)

CREATE TABLE IF NOT EXISTS `list` (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_public TINYINT(1) NOT NULL DEFAULT 1,
    user_id INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_list_user FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE
) 

CREATE TABLE IF NOT EXISTS `list_item` (
    id INT NOT NULL AUTO_INCREMENT,
    list_id INT NOT NULL,
    character_id VARCHAR(100),
    spells JSON,
    PRIMARY KEY (id),
    CONSTRAINT fk_item_list FOREIGN KEY (list_id) REFERENCES `list` (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_character FOREIGN KEY (character_id) REFERENCES `character` (id) ON DELETE SET NULL
)

CREATE TABLE IF NOT EXISTS `rating` (
    id INT NOT NULL AUTO_INCREMENT,
    rate INT CHECK (rate BETWEEN 1 AND 5),
    user_id   INT NOT NULL,
    character_id VARCHAR(100),
    spell_id VARCHAR(100),
    PRIMARY KEY (id),
    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES `user` (id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_character FOREIGN KEY (character_id) REFERENCES `character` (id) ON DELETE CASCADE,
    CONSTRAINT fk_rating_spell FOREIGN KEY (spell_id) REFERENCES `spell` (id) ON DELETE CASCADE
)
