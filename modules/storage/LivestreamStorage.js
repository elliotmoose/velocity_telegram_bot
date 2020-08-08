let livestreamCache = null

module.exports = (database) => {
    return {
        async getLivestreamLink() {
            if (livestreamCache) {
                return livestreamCache;
            } else {
                await this.pullLatestLivestreamLinkToCache();       
                return livestreamCache;
            }
        },

        async pullLatestLivestreamLinkToCache() {
            let link = await database.getDocument("livestream", "combined");
            if(!link)
            {
                console.log('LivestreamStorage: No livestream link to load for cache');
            }
            livestreamCache = link.link;
        },

        async setLivestreamLink(newLink) {
            await database.setDocument("livestream", "combined", {link: newLink});
            livestreamCache = newLink;
        }
    }
}