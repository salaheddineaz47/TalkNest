<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;


class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    // public function __construct(public Message $message)
    // {
    //     //
    // }
    public Message $message;

    public function __construct(Message $message)
    {
        \Log::info('SocketMessage event created', [
        'message_id' => $message->id
        ]);

        $this->message = $message;
    }

    public function broadcastWith(): array
    {
        return [
            'message' => new MessageResource($this->message),
        ];
    }


    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        \Log::info('broadcastOn method called');

        $m = $this->message;
        $channels = [];

            // Debug logging
        Log::debug('SocketMessage Event - Message Details:', [
            'message_id' => $m->id,
            'sender_id' => $m->sender_id,
            'receiver_id' => $m->receiver_id ?? null,
            'group_id' => $m->group_id ?? null,
            'content' => $m->message ?? 'No content'
        ]);

        if ($m->group_id) {
            $channel = 'message.group.' . $m->group_id;
            $channels[] = new PrivateChannel($channel);
            Log::debug('Broadcasting to group private channel:', ['channel' => $channel]);
        } else {
            if ($this->message->sender_id && $this->message->receiver_id) {
            $channel = 'message.user.' . collect([$m->sender_id, $m->receiver_id])->sort()->implode('-');
            $channels[] = new PrivateChannel($channel);
            Log::debug('Broadcasting to user private channel:', ['channel' => $channel]);
            } else {
                Log::warning('SocketMessage: Missing sender_id or receiver_id for direct message', [
                    'message_id' => $this->message->id,
                    'sender_id' => $this->message->sender_id,
                    'receiver_id' => $this->message->receiver_id
                ]);
            }
        }

        \Log::info('Broadcasting on channels:', [
        'channels' => array_map(fn($ch) => $ch->name, $channels)
        ]);

        return $channels;
    }

    public function broadcastAs()
    {
        return 'SocketMessage';
    }
}
