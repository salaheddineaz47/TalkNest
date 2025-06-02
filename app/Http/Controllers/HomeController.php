<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        //   dd(Conversation::getCoversationsForSidebar(Auth::user()));
        return inertia('Home');
    }
}
