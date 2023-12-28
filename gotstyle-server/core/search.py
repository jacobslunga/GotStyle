from datetime import datetime


def tokenize(text):
    return text.lower().split()


def search_outfits_by_hashtag(outfits: list, query: str, hashtag: str) -> list:
    query_tokens = tokenize(query)
    search_results = []

    for outfit in outfits:
        if hashtag not in [tag.lower() for tag in outfit["hashtags"]]:
            continue

        score = 0

    search_results.sort(key=lambda x: x[1], reverse=True)
    return [outfit for outfit, score in search_results]


def search_outfits(outfits: list, query: str) -> list:
    query_tokens = tokenize(query)
    search_results = []

    for outfit in outfits:
        score = 0

        for token in tokenize(outfit["description"]):
            if token in query_tokens:
                score += 1

        if outfit["user"]["username"].lower() in query_tokens:
            score += 2

        for hashtag in outfit["hashtags"]:
            if hashtag.lower() in query_tokens:
                score += 2

        time_factor = (datetime.now() - outfit["created_at"]).days
        score += max(0, (30 - time_factor) / 30)

        if score > 0:
            search_results.append((outfit, score))

    search_results.sort(key=lambda x: x[1], reverse=True)

    return [outfit for outfit, score in search_results]


def search_users(users: list, query: str) -> str:
    query_tokens = tokenize(query)
    search_results = []

    for user in users:
        score = 0

        for token in tokenize(user["username"]):
            if token in query_tokens:
                score += 1

        if user["username"].lower() in query_tokens:
            score += 2

        time_factor = (datetime.now() - user["created_at"]).days
        score += max(0, (30 - time_factor) / 30)

        if score > 0:
            search_results.append((user, score))

    search_results.sort(key=lambda x: x[1], reverse=True)

    return [user for user, score in search_results]
