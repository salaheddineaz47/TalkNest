<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MessageAtachmentResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message_id' => $this->message_id,
            'name' => $this->name,
            'size' => $this->size,
            'mime' => $this->mime,
            'url'=> Storage::url($this->path),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
