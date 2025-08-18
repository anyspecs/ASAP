package controller

import (
    "bytes"
    "encoding/json"
    "fmt"
    "gin-template/common"
    "github.com/gin-gonic/gin"
    "io"
    "mime/multipart"
    "net/http"
)

// Proxy upload to Dify Files API using server-side token
func DifyUpload(c *gin.Context) {
    if common.DifyApiToken == "" {
        c.JSON(http.StatusOK, gin.H{"success": false, "message": "Dify 未配置 API Token"})
        return
    }
    file, header, err := c.Request.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "缺少文件"})
        return
    }
    defer file.Close()

    user := c.PostForm("user")
    if user == "" { user = "chat-user" }
    ftype := c.PostForm("type")
    if ftype == "" { ftype = "TXT" }

    var buf bytes.Buffer
    writer := multipart.NewWriter(&buf)
    // file field
    fw, err := writer.CreateFormFile("file", header.Filename)
    if err != nil { c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()}); return }
    if _, err = io.Copy(fw, file); err != nil { c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()}); return }
    // other fields
    _ = writer.WriteField("user", user)
    _ = writer.WriteField("type", ftype)
    writer.Close()

    url := fmt.Sprintf("%s/files/upload", common.DifyApiBase)
    req, _ := http.NewRequest(http.MethodPost, url, &buf)
    req.Header.Set("Authorization", "Bearer "+common.DifyApiToken)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    resp, err := http.DefaultClient.Do(req)
    if err != nil { c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()}); return }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

// Proxy workflow run to Dify using server-side token
func DifyRunWorkflow(c *gin.Context) {
    if common.DifyApiToken == "" {
        c.JSON(http.StatusOK, gin.H{"success": false, "message": "Dify 未配置 API Token"})
        return
    }
    var payload map[string]any
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "无效的请求体"})
        return
    }
    b, _ := json.Marshal(payload)
    url := fmt.Sprintf("%s/workflows/run", common.DifyApiBase)
    req, _ := http.NewRequest(http.MethodPost, url, bytes.NewReader(b))
    req.Header.Set("Authorization", "Bearer "+common.DifyApiToken)
    req.Header.Set("Content-Type", "application/json")
    resp, err := http.DefaultClient.Do(req)
    if err != nil { c.JSON(http.StatusOK, gin.H{"success": false, "message": err.Error()}); return }
    defer resp.Body.Close()
    body, _ := io.ReadAll(resp.Body)
    c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}


