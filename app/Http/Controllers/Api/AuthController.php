<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;



class AuthController extends Controller
{
    // create a login, signup and logout operation

    public function login(LoginRequest $loginRequest)
    {
        $credentials = $loginRequest->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Provided email or password is incorrect'
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }
    public function signup(SignupRequest $signupRequest)
    {
        $data = $signupRequest->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
        $token = $user->createToken('main')->plainTextToken;
        return response(compact('user', 'token'));
    }

    // public function logout(Request $request)
    // {
    //     /** @var \App\Models\User $user */
    //     $user = $request->user();
    //     $user->currentAccessToken()->delete();
    //     return response('', 204);
    // }
    public function logout(Request $request)
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Successfully logged out',
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
