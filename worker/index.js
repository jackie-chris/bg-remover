/**
 * Cloudflare Worker - Background Remover API
 * 接收图片 Base64，调用 Remove.bg API，返回透明 PNG
 */

export default {
  async fetch(request, env, ctx) {
    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // 只接受 POST 请求
    if (request.method !== 'POST') {
      return jsonResponse({ error: 'METHOD_NOT_ALLOWED', message: '仅支持 POST 请求' }, 405);
    }

    try {
      // 解析请求体
      const body = await request.json();
      
      if (!body.image) {
        return jsonResponse({ error: 'NO_IMAGE', message: '未提供图片' }, 400);
      }

      // 调用 Remove.bg API
      const formData = new FormData();
      formData.append('image_file_b64', body.image);
      formData.append('size', 'auto');

      const apiResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': env.REMOVEBG_API_KEY
        },
        body: formData
      });

      // 处理 API 错误
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        
        // 解析错误类型
        if (apiResponse.status === 402 || apiResponse.status === 403) {
          return jsonResponse({ 
            error: 'QUOTA_EXCEEDED', 
            message: 'API 额度已用尽，请稍后再试' 
          }, 429);
        }
        
        if (apiResponse.status === 400) {
          return jsonResponse({ 
            error: 'INVALID_IMAGE', 
            message: '图片格式无效或无法处理' 
          }, 400);
        }

        return jsonResponse({ 
          error: 'API_ERROR', 
          message: '背景移除服务暂时不可用' 
        }, 500);
      }

      // 直接返回 PNG 流
      return new Response(apiResponse.body, {
        headers: {
          'Content-Type': 'image/png',
          ...corsHeaders()
        }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ 
        error: 'INTERNAL_ERROR', 
        message: '服务器内部错误' 
      }, 500);
    }
  }
};

/**
 * CORS 响应头
 */
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

/**
 * JSON 响应辅助函数
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders()
    }
  });
}
