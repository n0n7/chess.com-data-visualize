from rest_framework import status
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .fetch_data import fetch_game_data
import requests

# # Create your views here.
# class userApiView(APIView):
#     def get(request, format=None):
#         username = request.GET.get('username', '')
        
#         return Response({
#             'username':username
#         })

@api_view(['GET', 'POST'])
def get(request):
    username = request.GET.get('username', '')

    data = requests.get(f'https://api.chess.com/pub/player/{username}').json()
    if 'code' in data:
        # if username doesn't exist
        return JsonResponse({
            'message': f'can\'t find player name {username}',
            'status': status.HTTP_400_BAD_REQUEST,
        })

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
    rating_over_time = {}
    for game_data in games_data:
        if game_data['rules'] not in rating_over_time:
            rating_over_time[game_data['rules']] = {}
        if game_data['time_class'] not in rating_over_time[game_data['rules']]:
            rating_over_time[game_data['rules']][game_data['time_class']] = []
        rating_over_time[game_data['rules']][game_data['time_class']].append((game_data['time'], game_data['player_rating']))

    return rating_over_time