from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .fetch_data import fetch_game_data
import requests
import datetime


@api_view(['GET', 'POST'])
def get(request):
    username = request.GET.get('username', '')

    data = requests.get(f'https://api.chess.com/pub/player/{username}').json()
    print(data)
    if 'code' in data:
        # if username doesn't exist
        response = JsonResponse({
            'message': f"can't find player name '{username}'",
            'status': status.HTTP_400_BAD_REQUEST,
        })

        # futile attempt to get rid of CORS error
        response['Access-Control-Allow-Headers'] = "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Access-Control-Allow-Methods'] = 'GET, POST'
        response['SameSite'] = 'Lax'

        return response

    user_stats = requests.get(f'https://api.chess.com/pub/player/{username}/stats').json()
    user_stats['username'] = username
    user_games_data = fetch_game_data(username)


    data = {
        'user_stats':user_stats,
        'rating_over_time':get_rating_over_time(user_games_data)
    }

    return JsonResponse({
        'data': data,
        'status': status.HTTP_201_CREATED,
    })

def get_rating_over_time(games_data):
    rating_over_time = {
        'blitz':[],
        'rapid':[],
        'bullet':[],
    }
    for game_data in games_data:
        if game_data['rules'] != 'chess':
            continue
        if game_data['time_class'] not in rating_over_time:
            continue
        
        # format time
        time = datetime.datetime.fromtimestamp(game_data['time'])
        time_string = time.strftime('%Y-%m-%d %H:%M:%S')

        # append data
        data = {
            'x':time_string,
            'y':game_data['player_rating'],
        }
        rating_over_time[game_data['time_class']].append(data)

    return rating_over_time