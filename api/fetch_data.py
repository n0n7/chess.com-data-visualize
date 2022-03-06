import asyncio
from json import JSONDecodeError
from msilib import datasizemask
import httpx
from numpy import iterable

def fetch_game_data(username, request_limit=50):
    async def main(username):
        # get all game in eac month
        async def get_game_in_month(client, url, username):
            games = await client.get(url)
            for _ in range(request_limit):
                if games.status_code == 200:
                    break
                print(f'url:{url} , status:{games.status_code} {_+2}')
                await asyncio.sleep(1)
                games = await client.get(url)

            if games.status_code == 200:
                games = games.json()['games']
                games_data = [get_return_data(game, username) for game in games]
                return [game_data for game_data in  games_data if game_data is not None]
            return None

        # format data for each game
        def get_return_data(game_data, username):
            # get date game took place
            if not game_data['rated']:
                return None
            return_data = {
                'url':game_data['url'],
                'time_control':game_data['time_control'],
                'time_class':game_data['time_class'],
                'time':int(game_data['end_time'] * 1000),
                'rules': game_data['rules'],
                }
            if game_data['white']['username'].upper() == username.upper():
                return_data['player_rating'] = game_data['white']['rating']

            else:
                return_data['player_rating'] = game_data['black']['rating']

            del game_data['white']
            del game_data['black']

            return return_data

        # games url for each months
        async with httpx.AsyncClient() as client:
            game_int_month_api_urls = await client.get(f'https://api.chess.com/pub/player/{username}/games/archives')
            for _ in range(request_limit):
                print(f'username:{username} , status:{game_int_month_api_urls.status_code} {_+1}')
                if game_int_month_api_urls.status_code == 200:
                    break
                game_int_month_api_urls = await client.get(f'https://api.chess.com/pub/player/{username}/games/archives')


            game_int_month_api_urls = game_int_month_api_urls.json()['archives']
            tasks = (asyncio.ensure_future(get_game_in_month(client, url, username)) for url in game_int_month_api_urls)
            data = await asyncio.gather(*tasks, return_exceptions=True)
            
            return flatten_list(data)

    return asyncio.run(main(username))

def flatten_list(l):
    for e in l:
        if type(e) != list:
            print(e)
    return [e for sublist in l for e in sublist if l is not None]